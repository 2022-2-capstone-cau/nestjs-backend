import { IsString } from "class-validator";

export class AccessTokenDto {
	@IsString()
	accesstoken: string;
}

export class NicknameDto {
	@IsString()
	nickname: string;
}
