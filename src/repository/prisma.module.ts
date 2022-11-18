import { Global, Module } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { HomeRepository } from "./home.repository";

@Global()
@Module({
	providers: [UserRepository, HomeRepository],
	exports: [UserRepository, HomeRepository],
})
export class PrismaModule {}
