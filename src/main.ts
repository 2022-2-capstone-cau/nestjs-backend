import { NestFactory } from "@nestjs/core";
import { AppModule } from "./module/app.module";
import { SuccessResponse } from "./common/interceptors/SuccessResponse.interceptor";
import { GlobalExceptionFilter } from "./common/exceptions/Global.exception.filter";
import { ErrorResponseInterceptor } from "./common/interceptors/ErrorResponse.interceptor";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(new ValidationPipe());
	app.useGlobalInterceptors(new SuccessResponse());
	app.useGlobalInterceptors(new ErrorResponseInterceptor());
	app.useGlobalFilters(new GlobalExceptionFilter());

	await app.listen(3000);
}
bootstrap();
