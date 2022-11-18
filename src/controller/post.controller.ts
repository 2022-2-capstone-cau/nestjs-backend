import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { PostService } from "../service/post.service";
import { JwtAuthGuard } from "../common/guards/jwt.guard";

@Controller("/api/v1/post")
export class PostController {
	constructor(private readonly postService: PostService) {}

	@UseGuards(JwtAuthGuard)
	@Get("/book/isbn/:ISBN")
	LookupISPN(@Param("ISBN") isbn: string) {
		return this.postService.LookupISPN(isbn);
	}

	@UseGuards(JwtAuthGuard)
	@Get()
	getPostDetail() {
		return;
	}
}
