import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from "@nestjs/common";
import { PostService } from "../service/post.service";
import { JwtAuthGuard } from "../common/guards/jwt.guard";
import { BookIdDto, RegisterBookDto } from "../DTO/post.dto";

@Controller("/api/v1/post")
export class PostController {
	constructor(private readonly postService: PostService) {}

	// @UseGuards(JwtAuthGuard)
	@Get("/book/isbn/:ISBN")
	LookupISPN(@Param("ISBN") isbn: string) {
		return this.postService.LookupISPN(isbn);
	}

	@UseGuards()
	@Get("/:bookId")
	getPostDetail(@Param("bookId", ParseIntPipe) book_id: number) {
		return this.postService.getPostDetail(book_id);
	}

	@UseGuards(JwtAuthGuard)
	@Post("/book")
	registerNewBook(@Req() req, @Body() registerBookDto: RegisterBookDto) {
		return this.postService.registerNewBook(registerBookDto, req.user);
	}

	@UseGuards(JwtAuthGuard)
	@Post("/rent")
	rentBook(@Body() bookId: BookIdDto, @Req() req) {
		return this.postService.rentBook(bookId, req.user);
	}
}
