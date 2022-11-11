import { Body, Controller, Get, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "../service/user.service";
import { AccessTokenDto, NicknameDto } from "../DTO/user.dto";
import { IkakaoLogin, INicknameCheck } from "../Type/response/user.type.response";
import { Request } from "express";

@Controller("/api/v1/user")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post("/auth/kakao")
	kakaoLogin(@Body() accessTokenDto: AccessTokenDto): Promise<IkakaoLogin> {
		return this.userService.kakaoLogin(accessTokenDto);
	}

	@UseGuards()
	@Put("/me/nickname")
	nicknameUpdate(@Body() nicknameDto: NicknameDto): Promise<void> {
		return this.userService.nicknameUpdate(nicknameDto);
	}

	@UseGuards()
	@Post("/me/nickname/validate")
	nicknameCheck(@Body() nicknameDto: NicknameDto): Promise<INicknameCheck> {
		return this.userService.nicknameCheck(nicknameDto);
	}

	@UseGuards()
	@UseInterceptors()
	@Put("/me/image")
	profileImgUpdate(@UploadedFile() file: Express.Multer.File): Promise<void> {
		return this.userService.profileImgUpdate(file);
	}

	@UseGuards()
	@Get("/me/mypage")
	getMyPage(@Req() req: Request) {
		return this.userService.getMyPage(req);
	}
}
