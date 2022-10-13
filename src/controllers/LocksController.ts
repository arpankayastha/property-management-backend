import {BodyParams, Controller, Get, PathParams, Post, QueryParams} from "@tsed/common";
import moment from "moment/moment";
import {LocksRepository} from "../repositories/LocksRepository";
import {parseICSFile} from "../config/common/common";

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
                accessToken: '258473f8fe22a8e1637815a25c200d5c',
                date       : moment().valueOf()
            });
            console.log({locks});
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
                message: error.message || 'Something went wrong.'
            }
        }
    }

    @Get("/parse-ics-file")
    async parseICSFile(): Promise<object> {
        try {
            return {
                success: true,
                code   : 200,
                message: 'Lock has been retrieved.',
                data   : {
                    eventData: await parseICSFile()
                }
            };
        } catch (error) {
            return {
                success: false,
                code   : 201,
                message: error.message || 'Something went wrong. Please contact support team.',
            };
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
                accessToken: '258473f8fe22a8e1637815a25c200d5c',
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
                message: error.message || 'Something went wrong. Please contact support team.',
            };
        }
    }

    @Post("/manual-lock-access")
    async manualLockAccess(@BodyParams() bodyParams: any): Promise<object> {
        try {
            let assignPassword = await this.locksRepository.addNewPasswordToLock(bodyParams);
            return {
                success: true,
                code   : 200,
                message: 'Lock access has been granted.',
                data   : {
                    bodyParams,
                    assignPassword
                }
            };
        } catch (error) {
            return {
                success: false,
                code   : 201,
                message: error.message || 'Something went wrong. Please contact support team.',
            };
        }
    }
}
