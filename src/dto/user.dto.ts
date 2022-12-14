import { IsEmail, IsNumber, IsOptional, IsString, Length } from "class-validator";

export class CodeDto {
	authorized_code: string;
}

export class AccessTokenDto {
	@IsString()
	accesstoken: string;

	@IsString()
	@Length(1, 10)
	@IsOptional()
	nickname?: string;
}

export class CreateUserDto {
	@IsString()
	accesstoken: string;

	@IsString()
	@Length(1, 10)
	nickname: string;

	@IsString()
	profile?: string;
}

export class NicknameDto {
	@IsString()
	@Length(1, 10)
	nickname: string;
}

export class UserIdDto {
	@IsNumber()
	user_id: number;
}

export class JwtUserDto {
	user_id: any;

	email: string;
}

export class TokenDto {
	token: string;
}
