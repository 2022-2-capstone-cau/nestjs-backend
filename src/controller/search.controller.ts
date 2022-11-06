import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { HomeService } from "../service/home.service";
import { SearchService } from "../service/search.service";
import { SearchBooksDto } from "../DTO/search.dto";

@Controller("/api/v1/search")
export class SearchController {
	constructor(private readonly searchService: SearchService) {}

	@UseGuards()
	@Post()
	searchBooks(@Body() searchBooksDto: SearchBooksDto) {
		return;
	}
}
