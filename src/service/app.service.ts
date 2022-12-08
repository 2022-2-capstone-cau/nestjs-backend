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
		const user = await this.prisma.user.findMany({});
		const userLib = await this.prisma.userLib.findMany({});
		const book = await this.prisma.book.findMany({ include: { user: true, categories: true } });

		await this.prisma.room.deleteMany();
		await this.prisma.chat.deleteMany();

		await this.prisma.room.create({
			data: {
				user_id: 1,
				attn_id: 3,
				book_id: 9,
				last_message: "안녕하세요",
			},
		});
		await this.prisma.room.create({
			data: {
				user_id: 3,
				attn_id: 1,
				book_id: 9,
				last_message: "안녕하세요",
			},
		});
		await this.prisma.chat.create({
			data: {
				user_id: 3,
				attn_id: 1,
				book_id: 9,
				message: "안녕하세요",
			},
		});
		await this.prisma.chat.create({
			data: {
				user_id: 1,
				attn_id: 3,
				book_id: 9,
				message: "안녕하세요",
			},
		});

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
