import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class SearchRepository extends PrismaClient implements OnModuleInit {
	constructor() {
		super({
			log: [{ emit: "event", level: "query" }],
		});
	}

	async onModuleInit() {
		await this.$connect();
	}

	async enableShutdownHooks(app: INestApplication) {
		this.$on("beforeExit", async () => {
			await app.close();
		});
	}
}
