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
		const newCategory = await this.prisma.category.findUnique({
			where: { category: "IT" },
		});
		if (!newCategory) {
			await this.prisma.category.create({
				data: { category: "IT" },
			});
		}
		const category = await this.prisma.category.findMany({});
		const query = await this.prisma.$queryRaw`
			SELECT *
			FROM "CATEGORY" AS c
			GROUP BY c.category
		`;
		await this.prisma.userLib.upsert({
			where: { user_id: 1 },
			update: { best_category: "IT" },
			create: { best_category: "IT", user_id: 1 },
		});
		await this.prisma.userLib.upsert({
			where: { user_id: 2 },
			update: { best_category: "IT" },
			create: { best_category: "IT", user_id: 2 },
		});
		await this.prisma.userLib.upsert({
			where: { user_id: 3 },
			update: { best_category: "IT" },
			create: { best_category: "IT", user_id: 3 },
		});

		return {
			category,
			query,
		};
	}

	test() {
		return faker.date.past();
	}
}
