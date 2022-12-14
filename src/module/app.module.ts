import { Module } from "@nestjs/common";
import { AppController } from "../controller/app.controller";
import { AppService } from "../service/app.service";
import { PrismaModule } from "../repository/prisma.module";
import { UserModule } from "./user.module";
import { HomeModule } from "./home.module";
import { SearchModule } from "./search.module";
import { PostModule } from "./post.module";

@Module({
	imports: [PrismaModule, UserModule, HomeModule, SearchModule, PostModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
