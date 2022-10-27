import { Body, Controller, Get, Post, Put, UseGuards } from "@nestjs/common";
import { UserService } from "../service/user.service";
import { AccessTokenDto, NicknameDto } from "../dto/user.dto";

@Controller("/api/v1/user")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	getHello(): string {
		return this.userService.getHello(1);
	}

	@Post("/auth/kakao")
	kakaoLogin(@Body() accessTokenDto: AccessTokenDto) {
		return this.userService.getHello(accessTokenDto);
	}

	@Put("/me/nickname")
	@UseGuards()
	nicknameUpdate(@Body() nicknameDto: NicknameDto) {
		return this.userService.getHello(nicknameDto);
	}

	@Post("/me/nickname/validate")
	@UseGuards()
	nicknameCheck(@Body() nicknameDto: NicknameDto) {
		return this.userService.getHello(nicknameDto);
	}

	@Put("/me/image")
	@UseGuards()
	profileImgUpdate() {
		return this.userService.getHello(1);
	}

	@Get("/me/mypage")
	@UseGuards()
	getMyPage() {
		return this.userService.getHello(1);
	}
}
