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
		const books = await this.prisma.book.findMany({
			include: { categories: true },
		});

		return {
			books,
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
