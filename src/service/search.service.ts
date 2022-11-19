import { Injectable } from "@nestjs/common";
import { SearchBooksDto } from "../dto/search.dto";
import { SearchRepository } from "../repository/search.repository";

@Injectable()
export class SearchService {
	constructor(private readonly searchRepository: SearchRepository) {}

	async searchBooks(searchBooksDto: SearchBooksDto) {
		const books: any = await this.searchRepository.book.findMany({
			where: {
				name: {
					contains: searchBooksDto.query,
				},
			},
			take: 5,
			skip: 5 * (searchBooksDto.cursor - 1),
			select: {
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

		return {
			list: books.map((e) => ({
				book_id: e?.book_id,
				thumbnailUrl: e?.img,
				title: e?.name,
				isRent: e?.is_rent,
				user: {
					user_id: e?.user?.user?.user_id,
					name: e?.user?.user?.name,
				},
			})),
			nextCursor: Math.ceil(count / 5),
		};
	}
}
