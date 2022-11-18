import { IsEmail, IsNumber, IsOptional, IsString, Length } from "class-validator";

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

export class UserEmailDto {
	@IsString()
	@Length(1, 50)
	@IsEmail()
	email: string;
}
