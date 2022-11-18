import { IsNumber, IsString } from "class-validator";

export class SearchBooksDto {
	@IsString()
	query: string;

	@IsNumber()
	cursor?: number;
}
