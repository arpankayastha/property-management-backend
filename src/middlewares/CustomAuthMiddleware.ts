import {Context, Middleware, Next, Req, Res} from "@tsed/common";
import {getAuthRepository, getAuthUserDetails} from "../config/common/common";
import config from "../config/config";
// @ts-ignore
import * as jwt from "jsonwebtoken";

@Middleware()
export class CustomAuthMiddleware {
    public async use(@Req() request: Req, @Context() ctx: Context, @Res() res: Res, @Next() next: Next) {
        const errorResponse = {
            code: 401,
            success: false,
            message: "Unauthorized"
        }
        if (request.headers.authorization) {
            jwt.verify(request.headers.authorization, config.jwtSecret, function (err: any, decoded: any) {
                if (err) {
                    res.status(401);
                    return res.json(errorResponse);
                }
            });
            const authRepository = getAuthRepository(request.headers);
            let user = await getAuthUserDetails(authRepository, request.headers);
            if (!user) {
                res.status(401);
                return res.json(errorResponse);
            }
            ctx.set("user", user);
            return next();
        }
        res.status(401);
        return res.json(errorResponse);
    }
}