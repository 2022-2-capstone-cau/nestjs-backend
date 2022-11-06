import { IsString } from "class-validator";

export class SearchBooksDto {
	@IsString()
	query: string;

	@IsString()
	cursor?: string;
}
