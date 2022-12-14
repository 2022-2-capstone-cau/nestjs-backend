import { Body, Controller, Get, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "../service/user.service";
import { AccessTokenDto, CodeDto, NicknameDto, TokenDto } from "../dto/user.dto";
import { IkakaoLogin, INicknameCheck } from "../Type/response/user.type.response";
import { JwtAuthGuard } from "../common/guards/jwt.guard";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("/api/v1/user")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@UseGuards(JwtAuthGuard)
	@Get("/auth/kakao")
	testToken(@Req() req) {
		return req.user;
	}

	@Post("/auth/apple")
	appleLogin(@Body() codeDto: CodeDto): Promise<any> {
		return this.userService.appleLogin({
			authorized_code: codeDto.authorized_code,
		});
	}

	@Post("/auth/kakao")
	kakaoLogin(@Body() accessTokenDto: AccessTokenDto): Promise<IkakaoLogin> {
		return this.userService.kakaoLogin({
			accesstoken: accessTokenDto.accesstoken,
		});
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
	@UseInterceptors(FileInterceptor("profile"))
	@Put("/me/image")
	profileImgUpdate(@UploadedFile() file: Express.Multer.File, @Req() req): Promise<void> {
		return this.userService.profileImgUpdate(file?.destination, req.user);
	}

	@UseGuards(JwtAuthGuard)
	@Get("/me/mypage")
	getMyPage(@Req() req) {
		return this.userService.getMyPage(req.user);
	}

	@UseGuards(JwtAuthGuard)
	@Post("/token")
	addToken(@Body() tokenDto: TokenDto, @Req() req) {
		return this.userService.addToken(tokenDto, req.user);
	}
}
