import { IsString } from "class-validator";

export class UserDao {
	@IsString()
	email: string;

	profile: string | undefined;

	name: string;
}
