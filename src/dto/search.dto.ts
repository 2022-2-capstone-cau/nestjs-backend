import { IsString } from "class-validator";

export class SearchBooksDto {
	@IsString()
	query: string;

	cursor?: string;
}
