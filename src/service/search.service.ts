import { Injectable } from "@nestjs/common";
import { SearchBooksDto } from "../dto/search.dto";
import { SearchRepository } from "../repository/search.repository";
import { JwtUserDto } from "../dto/user.dto";

@Injectable()
export class SearchService {
	constructor(private readonly searchRepository: SearchRepository) {}

	async searchBooks(searchBooksDto: SearchBooksDto, user: JwtUserDto) {
		await this.searchRepository.search.create({
			data: { user_id: Number(user.user_id), content: searchBooksDto.query },
		});
		const books: any = await this.searchRepository.book.findMany({
			where: {
				name: {
					contains: searchBooksDto.query,
				},
			},
			take: 5,
			skip: 5 * (searchBooksDto.cursor ? Number(searchBooksDto.cursor) : 1 - 1),
			select: {
				book_id: true,
				img: true,
				name: true,
				is_rent: true,
				user: {
					select: {
						user: {
							select: {
								user_id: true,
								name: true,
							},
						},
					},
				},
			},
		});
		const count = await this.searchRepository.book.count({
			where: {
				name: {
					contains: searchBooksDto.query,
				},
			},
		});
		console.log(books);
		return {
			list: books.map((e) => {
				console.log(e);
				return {
					book_id: e?.book_id,
					thumbnailUrl: e?.img,
					title: e?.name,
					isRent: e?.is_rent,
					user: {
						user_id: e?.user?.user?.user_id,
						name: e?.user?.user?.name,
					},
				};
			}),
			nextCursor: Math.ceil(count / 5),
		};
	}
}
