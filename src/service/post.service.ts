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
					`https://www.nl.go.kr/NL/search/openApi/search.do?cert_key=${"1d69550499e62a8520be4b1b8d509d7df8829133ab22c539d14899258f19eae5"}&result_style=json&page_no=1&page_size=1&isbn=${isbn}`,
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

		return {
			thumbnailUrl: "http://cover.nl.go.kr/" + data?.result[0]?.imageUrl,
			title: data?.result[0]?.titleInfo,
			desc: data?.result[0],
			publisher: data?.result[0].pubInfo,
			writer: data?.result[0].authorInfo,
			pubYear: data?.result[0].pubYearInfo,
			tags: data?.result[0].kdcName1s,
		};
	}
}
