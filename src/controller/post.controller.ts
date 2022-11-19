import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards } from "@nestjs/common";
import { PostService } from "../service/post.service";
import { JwtAuthGuard } from "../common/guards/jwt.guard";
import { BookIdDto, CreateMsgDto, RegisterBookDto } from "../dto/post.dto";

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

	@UseGuards(JwtAuthGuard)
	@Post("/return")
	returnBook(@Body() bookId: BookIdDto, @Req() req) {
		return this.postService.returnBook(bookId, req.user);
	}

	@UseGuards(JwtAuthGuard)
	@Get("/room")
	getRooms(@Req() req) {
		return this.postService.getRooms(req.user);
	}

	@UseGuards(JwtAuthGuard)
	@Get("/chat")
	getChats(@Query("attn_id", ParseIntPipe) attn_id, @Req() req) {
		return this.postService.getChats(attn_id, req.user);
	}

	@UseGuards(JwtAuthGuard)
	@Post("/chat")
	createChats(@Body() createMsgDto: CreateMsgDto, @Req() req) {
		return this.postService.createChats(createMsgDto, req.user);
	}
}
