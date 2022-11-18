import { Injectable } from "@nestjs/common";
import { HomeRepository } from "../repository/home.repository";
import { UserEmailDto } from "../DTO/user.dto";

@Injectable()
export class HomeService {
	constructor(private readonly homeRepository: HomeRepository) {}

	async homeScreenData(user: UserEmailDto) {
		const userStatus: any = await this.homeRepository.user.findUnique({
			where: { email: user.email },
		});

		return {
			rent: {
				fastestRemainingReturnDay: userStatus?.return_date,
				numberOfRental: userStatus?.rental_total,
			},
			recommend: {
				category: {
					title: "",
				},
				list: [],
			},
		};
	}
}
