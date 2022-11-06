import { Module } from "@nestjs/common";
import { HomeController } from "../controller/home.controller";
import { HomeService } from "../service/home.service";

@Module({
	controllers: [HomeController],
	providers: [HomeService],
})
export class HomeModule {}
