import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { catchError } from "rxjs/operators";
import { of } from "rxjs";

@Injectable()
export class ErrorResponseInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler) {
		return next.handle().pipe(
			catchError((error) => {
				return of({
					success: false,
					error: {
						statusCode: error.status ? error.status : 500,
						message: error.status ? error.message : "API Broken",
					},
					body: null,
				});
			}),
		);
	}
}
