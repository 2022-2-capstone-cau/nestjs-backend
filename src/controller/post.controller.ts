import { Controller, Get, UseGuards } from "@nestjs/common";
import { PostService } from "../service/post.service";

@Controller("/api/v1/post")
export class PostController {
	constructor(private readonly postService: PostService) {}

	@UseGuards()
	@Get()
	LookupISPN() {
		return;
	}

	@UseGuards()
	@Get()
	getPostDetail() {
		return;
	}
}
