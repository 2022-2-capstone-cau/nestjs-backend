import { Module } from "@nestjs/common";
import { UserController } from "../controller/user.controller";
import { UserService } from "../service/user.service";
import { HttpModule } from "@nestjs/axios";

@Module({
	imports: [HttpModule.register({})],
	controllers: [UserController],
	providers: [UserService],
})
export class UserModule {}
