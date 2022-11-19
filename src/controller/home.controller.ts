import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { HomeService } from "../service/home.service";
import { JwtAuthGuard } from "../common/guards/jwt.guard";

@Controller("/api/v1/home")
export class HomeController {
	constructor(private readonly homeService: HomeService) {}

	// @UseGuards(JwtAuthGuard)
	@Get()
	homeScreenData(@Req() req) {
		return this.homeService.homeScreenData(req?.user);
	}
}
