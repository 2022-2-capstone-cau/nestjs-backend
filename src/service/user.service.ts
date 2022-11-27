import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { AccessTokenDto, CreateUserDto, NicknameDto, JwtUserDto, CodeDto, TokenDto } from "../dto/user.dto";
import { catchError, map } from "rxjs/operators";
import { UserRepository } from "../repository/user.repository";
import { IkakaoResponse } from "../Type/common/user.type.common";
import { firstValueFrom } from "rxjs";
import { JwtService } from "@nestjs/jwt";
import * as jwt from "jsonwebtoken";

@Injectable()
export class UserService {
	constructor(
		private readonly http: HttpService,
		private readonly userRepository: UserRepository,
		private readonly jwtService: JwtService,
	) {}

	async appleLogin(codeDto: CodeDto) {
		const cs = {
			kid: `${"U4QURYJ42Q"}`,
			alg: "ES256",
			iss: `${"NVW9ZFUJM3"}`,
			iat: Date.now(),
			exp: Date.now() + 3600 * 24 * 31 * 2,
			aud: "https://appleid.apple.com",
			sub: "Services ID - Identifier 값",
		};
		const data: any = await firstValueFrom(
			this.http
				.post(
					"https://appleid.apple.com/auth/token",
					{
						client_id: "CLIENT_ID",
						client_secret: "CLIENT_SECRET",
						code: "CODE",
						grant_type: "authorization_code",
						redirect_uri: "http://",
					},
					{
						headers: {
							"Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
						},
					},
				)
				.pipe(
					map((res) => res.data),
					catchError((e) => {
						console.log(e?.message);
						throw new HttpException("유효하지 않은 kakao token 입니다.", HttpStatus.BAD_REQUEST);
					}),
				),
		);

		console.log("apple data", data);
	}

	async kakaoLogin(accessTokenDto: any) {
		console.log("Access Token :", accessTokenDto.accesstoken);
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
					catchError((e) => {
						console.log(e?.message);
						throw new HttpException("유효하지 않은 kakao token 입니다.", HttpStatus.BAD_REQUEST);
					}),
				),
		);
		console.log(data);
		const exUser = await this.userRepository.findUserByEmail(data.id.toString());

		// 없는 유저이면 회원가입 후 로그인
		if (!exUser) {
			const newUser = await this.userRepository.user.create({
				data: {
					email: data.id.toString(),
				},
			});
			await this.userRepository.userLib.create({
				data: {
					user_id: newUser.user_id,
				},
			});
			await this.userRepository.userStatus.create({
				data: {
					user_id: newUser.user_id,
				},
			});
			console.log("newUser", newUser);
			return {
				accesstoken: this.jwtService.sign({ email: newUser.email, user_id: newUser.user_id }),
				requiresProfile: false,
			};
		}
		console.log("exUser", exUser);
		// 있는 유저이면 로그인
		return {
			accesstoken: this.jwtService.sign({ email: exUser?.email, user_id: exUser.user_id }),
			requiresProfile: !!exUser.name,
		};
	}

	async nicknameUpdate(nicknameDto: NicknameDto, user: JwtUserDto) {
		const exUser = await this.userRepository.findUserByEmail(user.email);

		if (!exUser) {
			throw new HttpException("없는 유저입니다.", HttpStatus.BAD_REQUEST);
		}

		await this.userRepository.user.update({
			where: { email: user.email },
			data: { name: nicknameDto.nickname },
		});

		return;
	}

	async nicknameCheck(nicknameDto: NicknameDto) {
		const exUser = await this.userRepository.findUserByNickname(nicknameDto.nickname);

		// 없는 닉네임이면 true
		if (!exUser.length) {
			return { allow: true };
		}

		// 있는 닉네임이면 false
		return { allow: false };
	}

	async profileImgUpdate(profile: string, user: JwtUserDto) {
		await this.userRepository.user.update({
			where: { email: user.email },
			data: { profile },
		});
		await this.userRepository.userLib.update({
			where: { user_id: parseInt(user.user_id) },
			data: { profile },
		});
		return;
	}

	async getMyPage(user: JwtUserDto) {
		const exUser: any = await this.userRepository.user.findUnique({
			where: { email: user.email },
			include: {
				library: true,
				user_info: true,
			},
		});

		return {
			user: {
				user_id: exUser.user_id,
				name: exUser.name,
				profile: exUser.profile,
			},
			summary: {
				popularCategory: {
					title: exUser.library.best_category,
				},
				numberOfOwn: exUser.library.book_total,
				numberOfRental: exUser.user_info.rental_total,
			},
			rents: [],
			owns: [],
		};
	}

	async addToken(tokenDto: TokenDto, user: JwtUserDto) {
		await this.userRepository.userSetting.update({
			where: { user_id: Number(user.user_id) },
			data: { token: tokenDto.token },
		});

		return { update: true };
	}
}
