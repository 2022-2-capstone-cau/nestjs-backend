import { HttpException, HttpStatus, Injectable, UploadedFile } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { AccessTokenDto, NicknameDto } from "../DTO/user.dto";
import { catchError, map } from "rxjs/operators";
import { Request } from "express";
import { UserRepository } from "../repository/user.repository";
import { IkakaoResponse } from "../Type/common/user.type.common";
import { firstValueFrom, Observable } from "rxjs";

@Injectable()
export class UserService {
	constructor(private readonly http: HttpService, private readonly userRepository: UserRepository) {}

	async kakaoLogin(accessTokenDto: AccessTokenDto) {
		const data: IkakaoResponse = await firstValueFrom(
			this.http
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
				),
		);

		const exUser = await this.userRepository.findUserByEmail(data.kakao_account.email);

		if (!exUser) {
		}

		return {
			accesstoken: "",
			requiresProfile: false,
		};
	}

	async nicknameUpdate(nicknameDto: NicknameDto) {
		return;
	}

	async nicknameCheck(nicknameDto: NicknameDto) {
		const exUser = await this.userRepository.findUserByNickname(nicknameDto.nickname);

		if (!exUser) {
			return { allow: true };
		}

		return { allow: false };
	}

	async profileImgUpdate(file: Express.Multer.File) {
		return;
	}

	async getMyPage(req: Request) {}
}
