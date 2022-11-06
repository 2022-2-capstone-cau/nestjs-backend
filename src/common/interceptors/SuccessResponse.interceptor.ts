import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export interface Response<T> {
	success: boolean;
	body: T;
}

@Injectable()
export class SuccessResponse<T> implements NestInterceptor<T, Response<T>> {
	intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
		if (context.switchToHttp().getResponse().status < 400) {
			return next.handle().pipe(map((data) => ({ success: true, body: data })));
		} else {
			return next.handle();
		}
	}
}
