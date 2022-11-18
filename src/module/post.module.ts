import { Module } from "@nestjs/common";
import { PostController } from "../controller/post.controller";
import { PostService } from "../service/post.service";
import { HttpModule } from "@nestjs/axios";

@Module({
	imports: [HttpModule.register({})],
	controllers: [PostController],
	providers: [PostService],
})
export class PostModule {}
