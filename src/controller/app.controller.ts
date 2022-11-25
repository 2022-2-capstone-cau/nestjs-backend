import { Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AppService } from "../service/app.service";
import { JwtAuthGuard } from "../common/guards/jwt.guard";

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	getHello(): string {
		return this.appService.getHello();
	}

	@UseGuards(JwtAuthGuard)
	@Post()
	getHello2(@Req() req): string {
		console.log(req.user);
		return req.user;
	}

	@UseGuards(JwtAuthGuard)
	@Post()
	updateAll(@Req() req): Promise<string> {
		return this.appService.updateAll();
	}
}
