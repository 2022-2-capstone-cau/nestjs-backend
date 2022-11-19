import { Injectable } from "@nestjs/common";
import { HomeRepository } from "../repository/home.repository";
import { JwtUserDto } from "../dto/user.dto";

@Injectable()
export class HomeService {
	constructor(private readonly homeRepository: HomeRepository) {}

	async homeScreenData(user: JwtUserDto) {
		// const userStatus: any = await this.homeRepository.user.findUnique({
		// 	where: { email: user.email },
		// });

		return this.homeRepository.$queryRaw`
			SELECT *
			FROM "USER"
		`;

		// return {
		// 	rent: {
		// 		fastestRemainingReturnDay: userStatus?.return_date,
		// 		numberOfRental: userStatus?.rental_total,
		// 	},
		// 	recommend: {
		// 		category: {
		// 			title: "",
		// 		},
		// 		list: [],
		// 	},
		// };
	}
}
