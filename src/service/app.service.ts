import { Injectable } from "@nestjs/common";
import { faker } from "@faker-js/faker";
import { PostRepository } from "../repository/post.repository";
import { PostService } from "./post.service";

@Injectable()
export class AppService {
	constructor(private readonly prisma: PostRepository, private readonly postService: PostService) {}

	getHello(): string {
		return "Hello World!";
	}

	async updateAll() {
		const r1 = [];
		const r2 = [];
		for (let i = 6; i < 40; i++) {
			if (i % 2 === 0) r1.push(i);
			if (i % 2 === 1) r2.push(i);
		}
		const result1 = await this.prisma.book.updateMany({
			where: {
				book_id: {
					in: r1,
				},
			},
			data: {
				user_id: 2,
			},
		});
		const result2 = await this.prisma.book.updateMany({
			where: {
				book_id: {
					in: r2,
				},
			},
			data: {
				user_id: 3,
			},
		});

		return {
			result1,
			result2,
		};
	}

	test() {
		return faker.date.past();
	}

	async query(query) {
		const rq = `${query.front}FROM "${query.from}" AS m${query.back}`;

		return this.prisma.$queryRaw`${rq}`;
	}
}
