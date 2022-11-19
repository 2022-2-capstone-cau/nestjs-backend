import { Module } from "@nestjs/common";
import { UserController } from "../controller/user.controller";
import { UserService } from "../service/user.service";
import { HttpModule } from "@nestjs/axios";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "../utils/jwt";
import { MulterModule } from "@nestjs/platform-express";
import * as multerS3 from "multer-s3";
import * as aws from "aws-sdk";
import { v4 } from "uuid";

@Module({
	imports: [
		HttpModule.register({}),
		PassportModule,
		JwtModule.register({ secret: "capstone", signOptions: { expiresIn: 1000 * 60 * 60 * 24 * 31 * 6 } }),
		MulterModule.register({
			storage: multerS3({
				s3: new aws.S3({
					accessKeyId: `${"AKIAYIU2QZ3CQSM5LME2"}`,
					secretAccessKey: `${"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"}`,
					region: "ap-northeast-2",
				}),
				bucket: `${"cau-capstone"}`,
				key: function (req, file, cb) {
					cb(null, `posts/${v4()}_${file.originalname}`);
				},
			}),
		}),
	],
	controllers: [UserController],
	providers: [UserService, JwtStrategy],
})
export class UserModule {}
