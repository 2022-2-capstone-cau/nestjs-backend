import { Injectable } from "@nestjs/common";
import { faker } from "@faker-js/faker";
import { PostRepository } from "../repository/post.repository";

@Injectable()
export class AppService {
	constructor(private readonly prisma: PostRepository) {}

	getHello(): string {
		return "Hello World!";
	}

	async updateAll() {
		const arr = new Array(10).fill(
			this.prisma.rent.create({
				data: {
					user_id: Math.ceil(Math.random() * 2),
					book_id: Math.ceil(Math.random() * 49),
					date: new Date(),
				},
			}),
		);

		await Promise.all(arr);

		// return this.prisma.rent.create({
		// 	data: {
		// 		user_id: 1,
		// 		book_id: 1,
		// 	},
		// });

		return "success";
	}

	test() {
		return faker.date.past();
	}
}
