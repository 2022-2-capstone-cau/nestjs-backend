import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { UserDao } from "../dao/user.dao";

@Injectable()
export class UserRepository extends PrismaClient implements OnModuleInit {
	async onModuleInit() {
		await this.$connect();
	}

	async enableShutdownHooks(app: INestApplication) {
		this.$on("beforeExit", async () => {
			await app.close();
		});
	}

	findUserByEmail(id: number) {
		return this.user.findUnique({
			where: { email: BigInt(id) },
		});
	}

	findUserById(userId: number) {
		return this.user.findUnique({
			where: { user_id: userId },
		});
	}

	// createUser(userDao: any) {
	// 	return this.user.create({
	// 		data: {
	// 			email: userDao.email,
	// 			name: userDao.name,
	// 			profile: userDao.profile,
	// 		},
	// 	});
	// }

	findUserByNickname(name: string) {
		return this.user.findMany({
			where: { name },
		});
	}
}
