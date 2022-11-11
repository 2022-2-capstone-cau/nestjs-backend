export interface IkakaoResponse {
	id: number;
	connected_at: string;
	kakao_account: {
		email: string;
		[propName: string]: any;
	};
	[propName: string]: any;
}
