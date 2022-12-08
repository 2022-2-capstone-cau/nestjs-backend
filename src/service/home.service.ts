import { Injectable } from "@nestjs/common";
import { HomeRepository } from "../repository/home.repository";
import { JwtUserDto } from "../dto/user.dto";

@Injectable()
export class HomeService {
	constructor(private readonly homeRepository: HomeRepository) {}

	async homeScreenData(user: JwtUserDto) {
		// return await this.homeRepository.$queryRaw`
		// 	SELECT u.user_id AS id
		// 	FROM "USER" AS u
		// 	GROUP BY u.user_id
		// `;
		// return await this.homeRepository.$queryRaw`
		//  SELECT *
		//  FROM (
		//  	SELECT c.category_name, COUNT(*)
		//  	FROM "RENT" AS r
		//  	JOIN "BOOK" AS b USING(book_id)
		//  	JOIN "CATEGORY_BOOK" AS c USING(book_id)
		//  	WHERE r.user_id = 1
		//  	GROUP BY c.category_name
		//  ) AS t
		//  ORDER BY t.count DESC
		//  LIMIT 1
		// `;
		const userStatus = await this.homeRepository.userStatus.findUnique({
			where: { user_id: Number(user.user_id) },
		});

		const date = await this.homeRepository.rent.findMany({
			where: {
				user_id: Number(user.user_id),
				book: {
					is_rent: true,
				},
			},
			orderBy: {
				rent_id: "asc",
			},
		});

		// const cate: any = await this.homeRepository.$queryRaw`
		//  SELECT *
		//  FROM (
		//  	SELECT c.category_name, COUNT(*)
		//  	FROM "RENT" AS r
		//  	JOIN "BOOK" AS b USING(book_id)
		//  	JOIN "CATEGORY_BOOK" AS c USING(book_id)
		//  	WHERE r.user_id = ${Number(user.user_id)}
		//  	GROUP BY c.category_name
		//  ) AS t
		//  ORDER BY t.count DESC
		//  LIMIT 1
		// `;

		const recom: any = await this.homeRepository.categoryBook.findMany({
			where: {
				category_name: "총류",
			},
			include: {
				book: true,
			},
		});

		// return this.homeRepository.$queryRaw`
		// 	SELECT *
		// 	FROM "USER"
		// `;

		return {
			rent: {
				fastestRemainingReturnDay: new Date(new Date(date[0].date).setDate(new Date(date[0].date).getDate() + 7)),
				numberOfRental: userStatus?.rental_total,
			},
			recommend: {
				category: "IT",
				list: recom.map((e) => ({
					book_id: e.book.book_id,
					title: e.book.name,
					thumbnailUrl: e.book.img,
				})),
			},
		};
	}
}
