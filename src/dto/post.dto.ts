import { IsString } from "class-validator";

export class RegisterBookDto {
	@IsString()
	isbn: string;

	@IsString()
	category: string;
}

export class BookIdDto {
	book_id: string;
}
