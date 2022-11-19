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

export class CreateMsgDto {
	@IsString()
	message: string;

	@IsString()
	attn_id: any;
}
