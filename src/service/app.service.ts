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
		let i = 0;

		while (i < 100) {
			await this.prisma.rent.create({
				data: {
					user_id: (i % 3) + 1,
					book_id: Math.round(Math.random() * 30),
					date: faker.date.past(),
				},
			});
		}

		return "success";
	}
}
