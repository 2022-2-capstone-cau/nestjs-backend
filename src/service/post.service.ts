import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { IkakaoResponse } from "../Type/common/user.type.common";
import { firstValueFrom } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable()
export class PostService {
	constructor(private readonly http: HttpService) {}

	async LookupISPN(isbn: string) {
		const data: any = await firstValueFrom(
			this.http
				.get(
					`https://www.nl.go.kr/NL/search/openApi/search.do?cert_key=${""}&result_style=json&page_no=1&page_size=1&isbn=${isbn}`,
					{
						headers: {},
					},
				)
				.pipe(
					map((res) => res.data),
					catchError(() => {
						throw new HttpException("네이버 도서 API가 유효하지 않습니다.", HttpStatus.BAD_REQUEST);
					}),
				),
		);

		return;
	}
}
