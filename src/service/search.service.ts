import { Injectable } from "@nestjs/common";
import { SearchBooksDto } from "../DTO/search.dto";

@Injectable()
export class SearchService {
	searchBooks(searchBooksDto: SearchBooksDto) {
		return {
			list: [],
			nextCursor: {},
		};
	}
}
