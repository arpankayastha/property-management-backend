import {BodyParams, Controller, Get, HeaderParams, Post, UseAuth} from "@tsed/common";
import {User} from "../entities/User";
import {getRepository} from "typeorm";
// @ts-ignore
import * as firebase from 'firebase-admin';
// @ts-ignore
import {generateJWTToken, getAuthRepository, getAuthUserDetails, getInitials} from "../config/common/common";
import {CustomAuthMiddleware} from "../middlewares/CustomAuthMiddleware";
import moment from "moment";

@Controller("/auth")

export class AuthController {
    @Post("/login")
    async login(@BodyParams() user: any): Promise<{}> {
        let {
                email,
                password
            } = user;
        if (!(email && password)) {
            return {
                success: false,
                code   : 201,
                message: 'Please enter required fields.'
            };
        }
        console.log('here');

        console.log({email});
        const userRepository = getRepository(User);
        let userDetail: User;
        try {
            userDetail = await userRepository.findOneOrFail({where: {email}});
            if (!userDetail.verifyPassword(password)) {
                return {
                    success: false,
                    code   : 201,
                    message: 'Something went wrong. Please contact support team.',
                };
            }
            userDetail.session_token = generateJWTToken(userDetail);
            userDetail               = await userRepository.save(userDetail);
            // @ts-ignore
            delete userDetail.password;
            return {
                success: true,
                code   : 200,
                message: 'Login.',
                data   : userDetail
            }

        } catch (error) {
            return {
                success: false,
                code   : 201,
                message: 'No record found or something went wrong. Please contact support team.',
            };
        }
    }

    @UseAuth(CustomAuthMiddleware)
    @Get("/get-user")
    async getUser(@HeaderParams() headerParams: any): Promise<{}> {
        const authRepository = getAuthRepository(headerParams);
        try {
            let userDetail             = await getAuthUserDetails(authRepository, headerParams);
            userDetail.initials        = getInitials(userDetail.name);
            userDetail.created_at_text = moment(userDetail.created_at).format("D MMM, Y")
            return {
                success: true,
                code   : 200,
                message: 'User Details fetch',
                data   : {
                    user: userDetail
                }
            }
        } catch (error) {
            return {
                success: false,
                code   : 201,
                message: 'No record found or something went wrong. Please contact support team.',
            };
        }
    }

    @Post('/logout')
    async logout(@HeaderParams() headerParams: any, @BodyParams() bodyParams: any) {
        const authRepository = getAuthRepository(headerParams);
        try {
            let userDetail           = await getAuthUserDetails(authRepository, headerParams);
            userDetail.session_token = '';
            await authRepository.save(userDetail);
            return {
                success: true,
                code   : 200,
                message: 'Logout successfully.'
            };
        } catch (error) {
            return {
                success: false,
                code   : 201,
                message: 'No record found or something went wrong. Please contact support team.',
            };
        }
    }
}
