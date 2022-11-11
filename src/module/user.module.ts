import { Module } from "@nestjs/common";
import { UserController } from "../controller/user.controller";
import { UserService } from "../service/user.service";
import { HttpModule } from "@nestjs/axios";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "../utils/jwt";

@Module({
	imports: [HttpModule.register({}), PassportModule, JwtModule.register({ secret: "capstone" })],
	controllers: [UserController],
	providers: [UserService, JwtStrategy],
})
export class UserModule {}
