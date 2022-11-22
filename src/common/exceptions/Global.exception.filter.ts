import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from "@nestjs/common";
import { Response } from "express";

@Catch(HttpException)
export class GlobalExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const status = exception.getStatus();
		console.log(exception.message);
		response.status(status).json({
			success: false,
			error: {
				statusCode: status,
				message: exception.message,
			},
			body: null,
		});
	}
}
