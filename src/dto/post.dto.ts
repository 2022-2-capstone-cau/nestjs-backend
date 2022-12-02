import { IsString } from "class-validator";

export class RegisterBookDto {
	@IsString()
	isbn: string;

	@IsString()
	category?: string;
}

export class BookIdDto {
	attn_id?: string;
	book_id: string;
	allow?: boolean;
}

export class CreateMsgDto {
	@IsString()
	message: string;

	@IsString()
	attn_id: any;

	@IsString()
	book_id: any;
}
