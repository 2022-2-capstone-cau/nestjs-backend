import { NestFactory } from "@nestjs/core";
import { AppModule } from "./module/app.module";
import { GlobalExceptionFilter } from "./common/exceptions/Global.exception.filter";
import { ErrorResponseInterceptor } from "./common/interceptors/ErrorResponse.interceptor";
import { ValidationPipe } from "@nestjs/common";
import * as morgan from "morgan";
import * as admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors({
		origin: "*",
		credentials: true,
	});
	app.use(morgan("combined"));

	// app.useGlobalPipes(new ValidationPipe());
	app.useGlobalFilters(new GlobalExceptionFilter());
	app.useGlobalInterceptors(new ErrorResponseInterceptor());
	// app.useGlobalInterceptors(new SuccessResponse());

	const adminConfig: ServiceAccount = {
		projectId: `${""}`,
		privateKey: `${"".replace(/\\n/g, "\n")}`,
		clientEmail: `${""}`,
	};

	await admin.initializeApp({
		credential: admin.credential.cert(adminConfig),
		databaseURL: process.env.FIREBASE_DATABASE,
	});

	await app.listen(3000);
}
bootstrap();
