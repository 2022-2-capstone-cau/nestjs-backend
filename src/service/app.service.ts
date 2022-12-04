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
		const books = await this.prisma.book.findMany();

		return {
			books,
		};
	}

	test() {
		return faker.date.past();
	}

	async query(query) {
		console.log(`
		SELECT ${query.where}
		FROM "${query.from}"
		`);

		return this.prisma.$queryRaw`
		SELECT ${query.where}
		FROM "${query.from}"
		`;
	}
}
