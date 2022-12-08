import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { JwtUserDto } from "../dto/user.dto";
import { PostRepository } from "../repository/post.repository";
import { BookIdDto, CreateMsgDto } from "../dto/post.dto";
import * as admin from "firebase-admin";

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
		const fcmTokens = await this.postRepository.user.findMany({
			select: {
				token: true,
			},
		});

		// console.log(data);
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

			const message = {
				notification: {
					title: "Home Brary",
					body: `${newBook.name} 책이 등록되었어요! 확인 해보세요!`,
				},
				topic: "all",
			};

			admin
				.messaging()
				.send(message)
				.then((res) => {
					console.log(res);
					return res;
				})
				.catch((error) => {
					console.log(error);
					throw new HttpException("send push all fcm error", HttpStatus.INTERNAL_SERVER_ERROR);
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

		const messageAll = {
			notification: {
				title: "Home Brary",
				body: `${newBook.name} 책이 등록되었어요! 확인 해보세요!`,
			},
			topic: "all",
		};

		// const messageTo1 = {
		// 	notification: {
		// 		title: "Home Brary",
		// 		body: `${newBook.name} 책이 등록되었어요! 확인 해보세요!`,
		// 	},
		// 	token: fcmTokens.map((e) => e.token)[0],
		// };
		//
		// const messageTo2 = {
		// 	notification: {
		// 		title: "Home Brary",
		// 		body: `${newBook.name} 책이 등록되었어요! 확인 해보세요!`,
		// 	},
		// 	token: fcmTokens.map((e) => e.token)[0],
		// };
		//
		// const messageTo3 = {
		// 	notification: {
		// 		title: "Home Brary",
		// 		body: `${newBook.name} 책이 등록되었어요! 확인 해보세요!`,
		// 	},
		// 	token: fcmTokens.map((e) => e.token)[0],
		// };

		// if (messageTo1?.token) {
		// 	admin
		// 		.messaging()
		// 		.send(messageTo1)
		// 		.then((res) => {
		// 			console.log(res);
		// 		})
		// 		.catch((error) => {
		// 			console.log(error);
		// 			throw new HttpException("send push all fcm error", HttpStatus.INTERNAL_SERVER_ERROR);
		// 		});
		// }
		//
		// if (messageTo2?.token) {
		// 	admin
		// 		.messaging()
		// 		.send(messageTo2)
		// 		.then((res) => {
		// 			console.log(res);
		// 		})
		// 		.catch((error) => {
		// 			console.log(error);
		// 			throw new HttpException("send push all fcm error", HttpStatus.INTERNAL_SERVER_ERROR);
		// 		});
		// }
		//
		// if (messageTo3?.token) {
		// 	admin
		// 		.messaging()
		// 		.send(messageTo3)
		// 		.then((res) => {
		// 			console.log(res);
		// 		})
		// 		.catch((error) => {
		// 			console.log(error);
		// 			throw new HttpException("send push all fcm error", HttpStatus.INTERNAL_SERVER_ERROR);
		// 		});
		// }

		admin
			.messaging()
			.send(messageAll)
			.then((res) => {
				console.log(res);
			})
			.catch((error) => {
				console.log(error);
				throw new HttpException("send push all fcm error", HttpStatus.INTERNAL_SERVER_ERROR);
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
		const data = await this.postRepository.room.findMany({
			where: {
				user_id: Number(user.user_id),
			},
			select: {
				attn_id: true,
				last_message: true,
				attn: {
					select: {
						user: true,
					},
				},
				user: {
					select: {
						user: true,
					},
				},
				book: true,
			},
		});

		return data.map((e) => ({
			attn_id: e.attn_id,
			book_id: e.book.book_id,
			bookName: e.book.name,
			bookURL: e.book.img,
			attn_name: e.attn.user.name,
			user_name: e.user.user.name,
		}));
	}

	async getChats(attn_id, book_id, user: JwtUserDto) {
		const myChat = await this.postRepository.chat.findMany({
			where: {
				user_id: Number(user.user_id),
				attn_id: attn_id,
				book_id: book_id,
			},
			include: {
				attn: true,
				user: true,
			},
			orderBy: {
				date: "asc",
			},
		});

		return myChat.map((e) => ({
			user_id: e.user_id,
			user_name: e.user.name,
			attn_id: e.attn_id,
			attn_name: e.attn.name,
			book_id: e.book_id,
			message: e.message,
			date: e.date,
		}));
	}

	async createChats(createMsgDto: CreateMsgDto, user: JwtUserDto) {
		await this.postRepository.room.upsert({
			where: {
				user_id_attn_id_book_id: {
					user_id: Number(user.user_id),
					attn_id: Number(createMsgDto.attn_id),
					book_id: Number(createMsgDto.book_id),
				},
			},
			update: {
				last_message: createMsgDto.message,
				last_date: new Date(),
			},
			create: {
				user_id: Number(user.user_id),
				attn_id: Number(createMsgDto.attn_id),
				book_id: Number(createMsgDto.book_id),
				last_message: createMsgDto.message,
				last_date: new Date(),
			},
		});

		await this.postRepository.room.upsert({
			where: {
				user_id_attn_id_book_id: {
					user_id: Number(createMsgDto.attn_id),
					attn_id: Number(user.user_id),
					book_id: Number(createMsgDto.book_id),
				},
			},
			update: {
				last_message: createMsgDto.message,
				last_date: new Date(),
			},
			create: {
				user_id: Number(createMsgDto.attn_id),
				attn_id: Number(user.user_id),
				book_id: Number(createMsgDto.book_id),
				last_message: createMsgDto.message,
				last_date: new Date(),
			},
		});

		const newMsg = await this.postRepository.chat.create({
			data: {
				user_id: Number(user.user_id),
				attn_id: Number(createMsgDto.attn_id),
				message: createMsgDto.message,
				book_id: Number(createMsgDto.book_id),
			},
		});

		return {
			user_id: newMsg.user_id,
			attn_id: newMsg.attn_id,
			date: newMsg.date,
			message: newMsg.message,
		};
	}
}
