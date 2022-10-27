import { Module } from "@nestjs/common";
import { AppController } from "../controller/app.controller";
import { AppService } from "../service/app.service";
import { PrismaModule } from "../repository/prisma.module";
import { UserModule } from "./user.module";

@Module({
	imports: [PrismaModule, UserModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
