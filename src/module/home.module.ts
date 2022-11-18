import { Module } from "@nestjs/common";
import { HomeController } from "../controller/home.controller";
import { HomeService } from "../service/home.service";
import { JwtStrategy } from "../utils/jwt";
import { JwtModule } from "@nestjs/jwt";

@Module({
	imports: [JwtModule],
	controllers: [HomeController],
	providers: [HomeService, JwtStrategy],
})
export class HomeModule {}
