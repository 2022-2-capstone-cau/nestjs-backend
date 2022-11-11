import { Body, Controller, Get, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "../service/user.service";
import { AccessTokenDto, NicknameDto } from "../DTO/user.dto";
import { IkakaoLogin, INicknameCheck } from "../Type/response/user.type.response";
import { JwtAuthGuard } from "../common/guards/jwt.guard";

@Controller("/api/v1/user")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post("/auth/kakao")
	kakaoLogin(@Body() accessTokenDto: AccessTokenDto): Promise<IkakaoLogin> {
		return this.userService.kakaoLogin(accessTokenDto);
	}

	@UseGuards(JwtAuthGuard)
	@Put("/me/nickname")
	nicknameUpdate(@Body() nicknameDto: NicknameDto, @Req() req): Promise<void> {
		return this.userService.nicknameUpdate(nicknameDto, req.user);
	}

	@UseGuards(JwtAuthGuard)
	@Post("/me/nickname/validate")
	nicknameCheck(@Body() nicknameDto: NicknameDto): Promise<INicknameCheck> {
		return this.userService.nicknameCheck(nicknameDto);
	}

	@UseGuards(JwtAuthGuard)
	@UseInterceptors()
	@Put("/me/image")
	profileImgUpdate(@UploadedFile() file: Express.Multer.File): Promise<void> {
		return this.userService.profileImgUpdate(file);
	}

	@UseGuards(JwtAuthGuard)
	@Get("/me/mypage")
	getMyPage(@Req() req) {
		return this.userService.getMyPage(req.user);
	}
}
