import { IsNumber, IsString } from "class-validator";

export class AccessTokenDto {
	@IsString()
	accesstoken: string;

	nickname?: string;

	profile?: any;
}

export class NicknameDto {
	@IsString()
	nickname: string;
}

export class UserIdDto {
	@IsNumber()
	user_id: number;
}

export class UserEmailDto {
	@IsString()
	email: string;
}
