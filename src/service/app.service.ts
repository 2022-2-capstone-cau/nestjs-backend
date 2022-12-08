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
		// const xx1 = await this.prisma.userLib.findUnique({ where: { user_id: 1 } });
		// const xx2 = await this.prisma.userLib.findUnique({ where: { user_id: 2 } });
		// const xx3 = await this.prisma.userLib.findUnique({ where: { user_id: 3 } });
		//
		// if (!xx1) await this.prisma.userLib.create({ data: { user_id: 1, best_category: "IT" } });
		// if (!xx2) await this.prisma.userLib.create({ data: { user_id: 1, best_category: "IT" } });
		// if (!xx3) await this.prisma.userLib.create({ data: { user_id: 1, best_category: "IT" } });
		//
		const user = await this.prisma.user.findMany({});
		const userLib = await this.prisma.userLib.findMany({});
		const book = await this.prisma.book.findMany({});

		return {
			user,
			userLib,
			book,
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
