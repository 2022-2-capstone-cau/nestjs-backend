import { Global, Module } from "@nestjs/common";
import { UserRepository } from "../repository/user.repository";

@Global()
@Module({
  providers: [UserRepository],
  exports: [UserRepository],
})
export class PrismaModule {}
