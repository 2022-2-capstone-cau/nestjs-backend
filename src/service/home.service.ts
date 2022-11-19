import { Injectable } from "@nestjs/common";
import { HomeRepository } from "../repository/home.repository";
import { JwtUserDto } from "../dto/user.dto";

@Injectable()
export class HomeService {
	constructor(private readonly homeRepository: HomeRepository) {}

	async homeScreenData(user: JwtUserDto) {
		const userStatus = await this.homeRepository.userStatus.findUnique({
			where: { user_id: parseInt(user.user_id) },
		});

		const date = await this.homeRepository.rent.findMany({
			where: {
				user_id: parseInt(user.user_id),
				book: {
					is_rent: true,
				},
			},
			orderBy: {
				date: "asc",
			},
		});

		// return this.homeRepository.$queryRaw`
		// 	SELECT *
		// 	FROM "USER"
		// `;

		return {
			rent: {
				fastestRemainingReturnDay: date[0].date,
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
