import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
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

	@Post("/update")
	updateAll() {
		return this.appService.updateAll();
	}

	@Get("/test")
	test() {
		return this.appService.test();
	}

	@Post("/query")
	query(@Body("query") query: string) {
		return this.appService.query(query);
	}
}
