import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { JwtUserDto } from "../dto/user.dto";
import { PostRepository } from "../repository/post.repository";
import { BookIdDto, CreateMsgDto } from "../dto/post.dto";

@Injectable()
export class PostService {
	constructor(private readonly http: HttpService, private readonly postRepository: PostRepository) {}

	async LookupISPN(isbn: string) {
		const data: any = await firstValueFrom(
			this.http
				.get(
					`https://www.nl.go.kr/NL/search/openApi/search.do?key=${"1d69550499e62a8520be4b1b8d509d7df8829133ab22c539d14899258f19eae5"}&detailSearch=true&isbnOp=isbn&isbnCode=${isbn}&apiType=json`,
					{
						headers: {},
					},
				)
				.pipe(
					map((res) => res.data),
					catchError(() => {
						throw new HttpException("네이버 도서 API가 유효하지 않습니다.", HttpStatus.BAD_REQUEST);
					}),
				),
		);
		if (data.total == 0) {
			return {
				thumbnailUrl: "",
				title: "검색결과 없음",
				desc: "검색결과 없음",
				publisher: "",
				writer: "",
				pubYear: "",
				tags: "",
			};
		}

		return {
			thumbnailUrl: "http://cover.nl.go.kr/" + data?.result[0]?.imageUrl,
			title: data?.result[0]?.titleInfo,
			desc: data?.result[0]?.titleInfo,
			publisher: data?.result[0].pubInfo,
			writer: data?.result[0].authorInfo,
			pubYear: data?.result[0].pubYearInfo,
			tags: data?.result[0].kdcName1s,
		};
	}

	async getPostDetail(book_id: number) {
		const exBook = await this.postRepository.book.findUnique({
			where: { book_id },
			include: { categories: true },
		});

		return {
			book_id: exBook.book_id,
			thumbnailUrl: exBook.img,
			title: exBook.name,
			desc: exBook.name,
			publisher: exBook.publisher,
			writer: exBook.author,
			translator: "",
			tags: exBook.categories[0].category_name,
			isbn: exBook.ISPN,
			isRent: exBook.is_rent,
		};
	}

	async registerNewBook(registerBookDto, user: JwtUserDto) {
		const [data, exUser] = await Promise.all([
			this.LookupISPN(registerBookDto.isbn),
			this.postRepository.user.findUnique({
				where: {
					user_id: Number(user.user_id),
				},
			}),
		]);

		if (data.title == "검색결과 없음") {
			throw new HttpException("검색결과 없음. 해당 ISBN 책이 없습니다.", HttpStatus.NOT_FOUND);
		}

		const exCategory = await this.postRepository.category.findUnique({ where: { category: data.tags } });
		console.log(data);
		if (!exCategory) {
			const newCate = await this.postRepository.category.create({ data: { category: data.tags } });

			const newBook = await this.postRepository.book.create({
				data: {
					img: data.thumbnailUrl,
					name: data.title,
					publisher: data.publisher,
					ISPN: registerBookDto.isbn,
					author: data.writer,
					user_id: exUser.user_id,
				},
			});

			await this.postRepository.categoryBook.create({
				data: {
					category_name: newCate.category,
					book_id: newBook.book_id,
				},
			});

			return { book_id: newBook.book_id };
		}

		const newBook = await this.postRepository.book.create({
			data: {
				img: data.thumbnailUrl,
				name: data.title,
				publisher: data.publisher,
				ISPN: registerBookDto.isbn,
				author: data.writer,
				user_id: exUser.user_id,
			},
		});

		await this.postRepository.categoryBook.create({
			data: {
				category_name: exCategory.category,
				book_id: newBook.book_id,
			},
		});

		return { book_id: newBook.book_id };
	}

	async rentBookCli(bookIdDto: BookIdDto, user: JwtUserDto) {
		await this.postRepository.room.create({
			data: {
				user_id: Number(bookIdDto.attn_id),
				attn_id: Number(user.user_id),
				book_id: Number(bookIdDto.book_id),
				last_message: "내용 없음",
			},
		});
		return;
	}

	async rentBook(bookIdDto: BookIdDto, user: JwtUserDto) {
		if (!bookIdDto.allow) {
			return {
				rent: false,
			};
		}
		// rent 처리
		await this.postRepository.book.update({
			where: { book_id: Number(bookIdDto.book_id) },
			data: { is_rent: true },
		});

		// 현재 상태 갱신
		await this.postRepository.userStatus.update({
			where: { user_id: Number(user.user_id) },
			data: { rental_total: { increment: 1 } },
		});

		// rent 정보 생성
		await this.postRepository.rent.create({
			data: {
				user_id: Number(bookIdDto.attn_id),
				book_id: Number(bookIdDto.book_id),
			},
		});

		return {
			rent: true,
		};
	}

	async returnBook(bookIdDto: BookIdDto, user: JwtUserDto) {
		// return 처리
		await this.postRepository.book.update({
			where: { book_id: parseInt(bookIdDto.book_id) },
			data: { is_rent: false },
		});

		// 현재 상태 갱신
		await this.postRepository.userStatus.update({
			where: { user_id: Number(user.user_id) },
			data: { rental_total: { decrement: 1 } },
		});

		return;
	}

	async getRooms(user: JwtUserDto) {
		const exUser = await this.postRepository.user.findUnique({
			where: { email: user.email },
		});

		const data = await this.postRepository.room.findMany({
			where: {
				user_id: Number(exUser.user_id),
			},
			select: {
				attn_id: true,
				last_message: true,
				attn: {
					select: {
						user: true,
					},
				},
			},
		});

		return data.map((e) => ({
			attn_id: e.attn_id,
			last_message: e.last_message,
			name: e.attn.user.name,
		}));
	}

	async getChats(attn_id: number, user: JwtUserDto) {
		return this.postRepository.chat.findMany({
			where: {
				user_id: Number(user.user_id),
				attn_id: Number(attn_id),
			},
			orderBy: {
				date: "desc",
			},
		});
	}

	async createChats(createMsgDto: CreateMsgDto, user: JwtUserDto) {
		const newMsg = await this.postRepository.chat.create({
			data: {
				user_id: Number(user.user_id),
				attn_id: Number(createMsgDto.attn_id),
				message: createMsgDto.message,
				book_id: Number(createMsgDto.book_id),
			},
		});

		this.postRepository.room.update({
			where: {
				user_id_attn_id_book_id: {
					user_id: Number(user.user_id),
					attn_id: Number(createMsgDto.attn_id),
					book_id: Number(createMsgDto.book_id),
				},
			},
			data: {
				last_message: newMsg.message,
				last_date: newMsg.date,
			},
		});

		return newMsg;
	}
}
