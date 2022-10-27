import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService {
	getHello(a: any): string {
		return "Hello World!";
	}
}
