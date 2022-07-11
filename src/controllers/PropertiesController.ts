import {BodyParams, Controller, Delete, Get, PathParams, Post, Put, QueryParams} from "@tsed/common";
import {Property} from "../entities/Property";
import {PropertiesRepository} from "../repositories/PropertiesRepository";

@Controller("/properties")
export class PropertiesController {
    constructor(private propertiesRepository: PropertiesRepository) {
        //
    }

    @Get("/")
    async getList(@QueryParams() requestData: any): Promise<object> {
        const limit           = (+requestData.pageNumber - 1) * +requestData.sizePerPage;
        const search          = requestData.search ? requestData.search : '';
        requestData.sortOrder = requestData.sortOrder == 'null' ? 'DESC' : requestData.sortOrder;
        requestData.sortField = requestData.sortField == 'null' ? 'id' : requestData.sortField;

        try {
            let properties_query = this.propertiesRepository.createQueryBuilder('property')
                .orderBy("property." + requestData.sortField, requestData.sortOrder.toUpperCase())
                .take(requestData.pageSize)
                .skip(limit);

            if (search) {
                properties_query = properties_query.where("property.name LIKE '%" + search + "%'");
            }
            const properties = await properties_query.getManyAndCount();

            return {
                success: true,
                code   : 200,
                message: 'Properties have been retrieved.',
                data   : {
                    properties : properties[0],
                    total_count: properties[1]
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

    @Post("/")
    async create(@BodyParams() property: any): Promise<object> {
        try {
            let roomDetail = new Property();
            if (property && property.id) {
                // @ts-ignore
                roomDetail = await this.propertiesRepository.findOne(property.id);
            }

            roomDetail = Object.assign(roomDetail, property);
            roomDetail = await this.propertiesRepository.save(roomDetail);
            return {
                success: true,
                code   : 200,
                message: (property.id) ? 'Property has been updated.' : 'Property has been created.',
                data   : {
                    property: roomDetail
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
            const property = await this.propertiesRepository.findByID(id);
            return {
                success: true,
                code   : 200,
                message: 'Property has been retrieved.',
                data   : {
                    property: property
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

    @Put("/:id")
    async update(@PathParams('id') id: string, @BodyParams() property: object) {
        try {
            let roomDetail = await this.propertiesRepository.findOneOrFail(id);
            await this.propertiesRepository.save({...roomDetail, ...property});
            return {
                success: true,
                code   : 200,
                message: 'Property has been updated.',
                data   : {
                    property: roomDetail
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
            await this.propertiesRepository.delete(id);
            return {
                success: true,
                code   : 200,
                message: 'Property has been deleted.'
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
