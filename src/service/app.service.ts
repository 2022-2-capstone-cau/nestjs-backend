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
		return await this.prisma.rent.updateMany({
			data: { date: new Date() },
		});
	}

	test() {
		return faker.date.past();
	}

	async query(query) {
		return this.prisma.$queryRaw`
		SELECT ${query.where}
		FROM "${query.from}"
		`;
	}
}
