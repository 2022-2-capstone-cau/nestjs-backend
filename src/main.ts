import { NestFactory } from "@nestjs/core";
import { AppModule } from "./module/app.module";
import { GlobalExceptionFilter } from "./common/exceptions/Global.exception.filter";
import { ErrorResponseInterceptor } from "./common/interceptors/ErrorResponse.interceptor";
import { ValidationPipe } from "@nestjs/common";
import * as morgan from "morgan";
import * as admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors({
		origin: "*",
		credentials: true,
	});
	app.use(morgan("combined"));

	// app.useGlobalPipes(new ValidationPipe());
	app.useGlobalFilters(new GlobalExceptionFilter());
	app.useGlobalInterceptors(new ErrorResponseInterceptor());
	// app.useGlobalInterceptors(new SuccessResponse());

	const adminConfig: ServiceAccount = {
		projectId: `${"homebrary-7ce86"}`,
		privateKey: `${"MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCLQjRNzKxQzdjt\\ndvtgPV0TtYZxgnis/+BA0OFY/nKx2JWzfJPWvLg+9cCfWK1RJ4Rw1FXOSW1q/lRl\\niUbltJyUY6rvfJRXAmd5wx6tsTTSJXQ/0fTfN7lOxYdR710Y5M8Zw27AjqDsvevU\\nPSzLRZrIffLP3KaWJwHZzCkFSSfiUpAhIos4nUpEWTKJTzsIyVLUMWAAonGDe94k\\nKKgeXEPlzeSKF9o6ftVysPtk6yVu9+f9rzGAQqtletPDOEidwYNjkqZuFvw2HuwR\\n5KX9OyT5P7kXN5ltJdq079ZF9LPwHsjHJCkeVDG8s0LDmnmbDsNWhq2nUxGErqJ8\\npOiZPZp1AgMBAAECggEADN6O59uw1vzW/cb/nxq8pcwiQw4sKcyxxDupf6hwIAhk\\neURbgz5IhqT+aptu1O+ieSzeSySVBIzBbuq7TxIcYEg/rUcljE7wEhwakzGrsHn+\\nnsE/8Hr9WI6/nS5SO7E1hGt/qjLkI0y/5QrMP3LMxZeCH3yENp8fOCn6Zn8mvO8C\\ncvImr2JyFxlWBVjE++MxfblpCY1IXEYUKnW/KtyCR00RE+CAZA/Ff/Zd/kIKhFqf\\n1pvPTChY8drR/QsfikJqu0y2yyhv8YoVQ7FEt7/dCeKk9Ak/kAaxMrjFoC2QgHjX\\n0Cb+pD7PfvTVB55kwilVUoEF16mxUAoOJ62eDtIilwKBgQDBuv5G/I9KK/w9PuM5\\nQNP0qK3nduXO0pkuuLwBUjvK7xlKt42EcGauA+4Lj0owXvpmxvGummIJYu8M2n0X\\nY+E1DI9eZXJJkCYZAMqBKcOtPbuEhetspxmXDjV9u76uZ/VpQfcfP+ajz0L+E/TB\\n6Kn8aPETlPdagdB8Tw+HwDW6HwKBgQC4BQZ2LGjmb6wPER1PVmAJsxgpLiX5AEop\\nUhv0kSz/zwWSUnaKxT9rQ5GMPom9e8/DDvr5UJ7sA4cyjUyoAYNF61X0c/QjMIcG\\nQ3wlwVR6bVqerOP1GB9x2sMJ2+MapL3kn9WdVYAvRtgPPVBcepL0y+G2iCNqAlLo\\ndLsy4hxA6wKBgCJYp6ooLrNEtxSYqKpG3w0aNrK5tqaDWdsZr2NAlA83crF3d2SK\\nlPm3AqYUAmAvBo/gJ4sAHe9yFdWeitzxvUStdGGU9L0sDEUUidJ6eBGnxy4InCOI\\nQJYyU7N17Kl5Dt5Zbpmgt6BFJ6hqG1OhjzmL1WnWWEA4kaDoV2WG4z+bAoGBAI3V\\nibpx1lSuhA6E4XNyHsm7GYc8A5ada4vXtqZVczqkBSZXmviwuYXiaX+QADhlAqjU\\nlgqt4iAFRCJpmEjyCY1Nq02kResNjzT7tOeg0I0gVjVxCq6xbiMiOywRKEUz7w0V\\nSN9gtFE8KHHuj08IRtaZgppe6fTeX6q9tj+s2ZwLAoGABYuqrX48752IfloAjqOn\\nRx1xY9KyoanaJ3lHGvkDTXRaP2aUvwLEStuQZXzxEjtS9VKgSHlj7lUdcmRnpWkj\\nb7sOc9qbX1zHILA02FNi6nE2PNGG/h/oVIhcFWYm7gU1GxndmbtJsA+u0PTaBvjL\\n5e0ycmR1RUwKhUoQQv3cySE=\\n".replace(
			/\\n/g,
			"\n",
		)}`,
		clientEmail: `${"firebase-adminsdk-1by5b@homebrary-7ce86.iam.gserviceaccount.com"}`,
	};

	await admin.initializeApp({
		credential: admin.credential.cert(adminConfig),
	});

	await app.listen(3000);
}
bootstrap();
