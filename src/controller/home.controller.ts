import { Controller, Get, UseGuards } from "@nestjs/common";
import { HomeService } from "../service/home.service";

@Controller("/api/v1/home")
export class HomeController {
	constructor(private readonly homeService: HomeService) {}

	@UseGuards()
	@Get()
	homeScreenData() {
		// return this.homeService.homeScreenData();
		return;
	}
}
