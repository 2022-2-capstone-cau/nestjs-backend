import { IsNumber, IsString } from "class-validator";

export class AccessTokenDto {
	@IsString()
	accesstoken: string;
}

export class NicknameDto {
	@IsString()
	nickname: string;
}

export class UserIdDto {
	@IsNumber()
	user_id: number;
}
