import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { AccessTokenDto, CreateUserDto, NicknameDto, UserEmailDto } from "../DTO/user.dto";
import { catchError, map } from "rxjs/operators";
import { UserRepository } from "../repository/user.repository";
import { IkakaoResponse } from "../Type/common/user.type.common";
import { firstValueFrom } from "rxjs";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserService {
	constructor(
		private readonly http: HttpService,
		private readonly userRepository: UserRepository,
		private readonly jwtService: JwtService,
	) {}

	async kakaoLogin(accessTokenDto: AccessTokenDto | CreateUserDto) {
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

		// 없는 유저이면 회원가입 후 로그인
		if (!exUser) {
			const newUser = await this.userRepository.createUser({
				email: data.kakao_account.email,
				name: (<CreateUserDto>accessTokenDto)?.nickname,
				profile: (<CreateUserDto>accessTokenDto)?.profile,
			});

			return {
				accesstoken: this.jwtService.sign({ email: newUser.email }),
				requiresProfile: !newUser?.profile,
			};
		}

		// 있는 유저이면 로그인
		return {
			accesstoken: this.jwtService.sign({ email: exUser?.email }),
			requiresProfile: !exUser?.profile,
		};
	}

	async nicknameUpdate(nicknameDto: NicknameDto, user: UserEmailDto) {
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
		if (!exUser) {
			return { allow: true };
		}

		// 있는 닉네임이면 false
		return { allow: false };
	}

	async profileImgUpdate(profile: string, user: UserEmailDto) {
		await this.userRepository.user.update({
			where: { email: user.email },
			data: { profile },
		});
		return;
	}

	async getMyPage(user: UserEmailDto) {
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
}
