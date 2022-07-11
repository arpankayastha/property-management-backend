import {Controller, Get, PathParams, QueryParams} from "@tsed/common";
import moment from "moment/moment";
import {LocksRepository} from "../repositories/LocksRepository";

@Controller("/locks")
export class LocksController {
    constructor(private locksRepository: LocksRepository) {
        //
    }

    @Get("/")
    async getList(@QueryParams() requestData: any): Promise<object> {
        try {
            let locks = await this.locksRepository.getList('http://api.sciener.com/v3/lock/list', {
                pageNo     : 1,
                pageSize   : 20,
                clientId   : 'e4336fa2848b43f6ae756dedebb7608c',
                accessToken: '116ad564818d713d69d025eba52c976d',
                date       : moment().valueOf()
            });

            return {
                success: true,
                code   : 200,
                message: 'Locks have been retrieved.',
                data   : {
                    locks
                }
            }
        } catch (error) {
            console.log({error});
            return {
                success: false,
                code   : 201,
                message: 'Something went wrong.'
            }
        }
    }

    @Get("/:id")
    async get(@PathParams('id') id: string): Promise<object> {
        try {
            let lockDetail = await this.locksRepository.getDetail('http://api.sciener.com/v3/lock/listKeyboardPwd', {
                pageNo     : 1,
                pageSize   : 20,
                lockId     : id,
                clientId   : 'e4336fa2848b43f6ae756dedebb7608c',
                accessToken: '116ad564818d713d69d025eba52c976d',
                date       : moment().valueOf()
            });
            return {
                success: true,
                code   : 200,
                message: 'Lock has been retrieved.',
                data   : {
                    lock: lockDetail
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
}
