import {BodyParams, Controller, Delete, Get, PathParams, Post, QueryParams} from "@tsed/common";
import {User} from "../entities/User";
import {UsersRepository} from "../repositories/UsersRepository";

@Controller("/users")
export class UsersController {
    constructor(private usersRepository: UsersRepository) {
        //
    }

    @Get("/")
    async getList(@QueryParams() requestData: any): Promise<object> {
        const limit  = (+requestData.pageNumber - 1) * +requestData.sizePerPage;
        const search = requestData.search ? requestData.search : '';
        try {
            let users_query = this.usersRepository.createQueryBuilder('users')
                .take(+requestData.sizePerPage)
                .skip(limit);

            if (search) {
                users_query = users_query.where("users.name LIKE '%" + search + "%'")
                    .orWhere("users.email LIKE '%" + search + "%'")
                    .orWhere("users.phone LIKE '%" + search + "%'");
            }
            const users = await users_query.getManyAndCount();

            return {
                success: true,
                code   : 200,
                message: 'Users have been retrieved.',
                data   : {
                    users      : users[0],
                    total_count: users[1]
                }
            }
        } catch (error) {
            return {
                success: false,
                code   : 201,
                message: error.message
            }
        }
    }

    @Post("/")
    async create(@BodyParams() user: any): Promise<object> {
        try {
            let userDetail = new User();
            // @ts-ignore
            if (user && user.id) {
                // @ts-ignore
                userDetail = await this.usersRepository.findOne(user.id);
            }
            userDetail = Object.assign(userDetail, user);
            userDetail.hashPassword();
            userDetail = await this.usersRepository.save(userDetail);
            return {
                success: true,
                code   : 200,
                message: (user.id) ? 'User has been updated.' : 'User has been created.',
                data   : {
                    user: userDetail
                }
            };
        } catch (error) {
            return {
                success: false,
                code   : error.code,
                message: error.message,
            };
        }
    }

    @Get("/:id")
    async get(@PathParams('id') id: string): Promise<object> {
        try {
            const user = await this.usersRepository.findByID(id);
            return {
                success: true,
                code   : 200,
                message: 'User has been retrieved.',
                data   : {
                    user: user
                }
            };
        } catch (error) {
            return {
                success: false,
                code   : 201,
                message: 'Something went wrong. Please contact support team.',
            };
        }
    }

    @Delete("/:id")
    async delete(@PathParams('id') id: string): Promise<object | undefined> {
        try {
            await this.usersRepository.delete(id);
            return {
                success: true,
                code   : 200,
                message: 'User has been deleted.'
            };
        } catch (error) {
            return {
                success: false,
                code   : 201,
                message: 'Something went wrong. Please contact support team.',
            };
        }
    }
}
