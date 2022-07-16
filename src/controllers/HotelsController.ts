import {BodyParams, Controller, Delete, Get, PathParams, Post, QueryParams} from "@tsed/common";
import {Hotel} from "../entities/Hotel";
import {HotelsRepository} from "../repositories/HotelsRepository";

@Controller("/hotels")
export class HotelsController {
    constructor(private hotelsRepository: HotelsRepository) {
        //
    }

    @Get("/")
    async getList(@QueryParams() requestData: any): Promise<object> {
        try {
            let hotels = await this.hotelsRepository.findAll(requestData);
            return {
                success: true,
                code   : 200,
                message: 'Hotels have been retrieved.',
                data   : {
                    hotels     : hotels[0],
                    total_count: hotels[1]
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
    async create(@BodyParams() hotel: any): Promise<object> {
        try {
            let hotelDetail = new Hotel();
            if (hotel && hotel.id) {
                // @ts-ignore
                hotelDetail = await this.hotelsRepository.findOne(hotel.id);
            }

            hotelDetail = Object.assign(hotelDetail, hotel);
            hotelDetail = await this.hotelsRepository.save(hotelDetail);
            return {
                success: true,
                code   : 200,
                message: (hotel.id) ? 'Hotel has been updated.' : 'Hotel has been created.',
                data   : {
                    hotel: hotelDetail
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

    @Get("/:id")
    async get(@PathParams('id') id: string): Promise<object> {
        try {
            const hotel = await this.hotelsRepository.findByID(id, ['properties']);
            return {
                success: true,
                code   : 200,
                message: 'Hotel has been retrieved.',
                data   : {
                    hotel: hotel
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

    @Delete("/:id")
    async delete(@PathParams('id') id: string): Promise<object | undefined> {
        try {
            await this.hotelsRepository.delete(id);
            return {
                success: true,
                code   : 200,
                message: 'Hotel has been deleted.'
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
