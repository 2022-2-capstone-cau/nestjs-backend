import { HttpException, HttpStatus, Injectable, UploadedFile } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { AccessTokenDto, NicknameDto } from "../DTO/user.dto";
import { catchError, map } from "rxjs/operators";
import { Request } from "express";

@Injectable()
export class UserService {
	constructor(private readonly http: HttpService) {}

	getHello(a: any): string {
		return "Hello World!";
	}

	async kakaoLogin(accessTokenDto: AccessTokenDto) {
		const data: any = await this.http
			.get("https://kapi.kakao.com/v2/user/me", {
				headers: {
					"Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
					Authorization: `Bearer ${accessTokenDto.accesstoken}`,
				},
			})
			.pipe(
				map((res) => res.data),
				catchError(() => {
					throw new HttpException("유효하지 않은 kakao token 입니다.", HttpStatus.BAD_REQUEST);
				}),
			);

		return {
			accesstoken: "",
			requiresProfile: false,
		};
	}

	async nicknameUpdate(nicknameDto: NicknameDto) {
		return;
	}

	async nicknameCheck(nicknameDto: NicknameDto) {
		return { allow: true };
	}

	async profileImgUpdate(file: Express.Multer.File) {
		return;
	}

	async getMyPage(req: Request) {}
}
