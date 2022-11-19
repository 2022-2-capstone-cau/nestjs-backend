import { Global, Module } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { HomeRepository } from "./home.repository";
import { PostRepository } from "./post.repository";
import { SearchRepository } from "./search.repository";

@Global()
@Module({
	providers: [UserRepository, HomeRepository, PostRepository, SearchRepository],
	exports: [UserRepository, HomeRepository, PostRepository, SearchRepository],
})
export class PrismaModule {}
