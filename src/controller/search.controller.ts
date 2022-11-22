import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { HomeService } from "../service/home.service";
import { SearchService } from "../service/search.service";
import { SearchBooksDto } from "../dto/search.dto";
import { JwtAuthGuard } from "../common/guards/jwt.guard";

@Controller("/api/v1/search")
export class SearchController {
	constructor(private readonly searchService: SearchService) {}

	@UseGuards(JwtAuthGuard)
	@Post()
	searchBooks(@Body() searchBooksDto: SearchBooksDto, @Req() req) {
		return this.searchService.searchBooks(searchBooksDto, req.user);
	}
}
