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
		const arr = new Array(15).fill(
			this.prisma.rent.create({
				data: {
					user_id: Math.ceil(Math.random() * 2),
					book_id: Math.ceil(Math.random() * 49),
					date: new Date(),
				},
			}),
		);

		const exUser1 = await this.prisma.user.findUnique({ where: { user_id: 1 } });
		const exUser2 = await this.prisma.user.findUnique({ where: { user_id: 2 } });
		const exUser3 = await this.prisma.user.findUnique({ where: { user_id: 3 } });
		await this.postService.rentBook({ book_id: "30" }, { user_id: "1", email: exUser1.email });
		await this.postService.rentBook({ book_id: "31" }, { user_id: "1", email: exUser1.email });
		await this.postService.rentBook({ book_id: "32" }, { user_id: "1", email: exUser1.email });
		await this.postService.rentBook({ book_id: "33" }, { user_id: "1", email: exUser1.email });
		await this.postService.rentBook({ book_id: "34" }, { user_id: "1", email: exUser1.email });
		await this.postService.rentBook({ book_id: "35" }, { user_id: "2", email: exUser2.email });
		await this.postService.rentBook({ book_id: "36" }, { user_id: "2", email: exUser2.email });
		await this.postService.rentBook({ book_id: "37" }, { user_id: "2", email: exUser2.email });
		await this.postService.rentBook({ book_id: "38" }, { user_id: "2", email: exUser2.email });
		await this.postService.rentBook({ book_id: "39" }, { user_id: "2", email: exUser2.email });
		await this.postService.rentBook({ book_id: "40" }, { user_id: "3", email: exUser3.email });
		await this.postService.rentBook({ book_id: "41" }, { user_id: "3", email: exUser3.email });
		await this.postService.rentBook({ book_id: "42" }, { user_id: "3", email: exUser3.email });
		await this.postService.rentBook({ book_id: "43" }, { user_id: "3", email: exUser3.email });

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
