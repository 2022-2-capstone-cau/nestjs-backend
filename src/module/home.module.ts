import { Module } from "@nestjs/common";
import { HomeController } from "../controller/home.controller";
import { HomeService } from "../service/home.service";
import { JwtStrategy } from "../utils/jwt";
import { JwtModule } from "@nestjs/jwt";

@Module({
	controllers: [HomeController, JwtModule],
	providers: [HomeService, JwtStrategy],
})
export class HomeModule {}
