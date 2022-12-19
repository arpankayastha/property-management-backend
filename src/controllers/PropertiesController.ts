import {BodyParams, Controller, Delete, Get, PathParams, Post, QueryParams} from "@tsed/common";
import {Property} from "../entities/Property";
import {PropertiesRepository} from "../repositories/PropertiesRepository";
const ical = require('node-ical');

@Controller("/properties")
export class PropertiesController {
    constructor(private propertiesRepository: PropertiesRepository) {
        //
    }

    @Get("/")
    async getList(@QueryParams() requestData: any): Promise<object> {
        try {
            let properties = await this.propertiesRepository.findAll(requestData);
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
            return {
                success: false,
                code   : 201,
                message: error.message
            }
        }
    }

    @Post("/")
    async create(@BodyParams() property: any): Promise<object> {
        try {
            let propertyDetail = new Property();
            if (property && property.id) {
                // @ts-ignore
                propertyDetail = await this.propertiesRepository.findOne(property.id);
            }

            propertyDetail = Object.assign(propertyDetail, property);
            propertyDetail = await this.propertiesRepository.save(propertyDetail);
            return {
                success: true,
                code   : 200,
                message: (property.id) ? 'Property has been updated.' : 'Property has been created.',
                data   : {
                    property: propertyDetail
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
            const property = await this.propertiesRepository.findByID(id, ["hotel"]);
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
                message: error.message || 'Something went wrong. Please contact support team.',
            };
        }
    }
    @Get("/autoFillData/:id")
    async autoFillData(@PathParams() PathParams: any): Promise<object> {
        try {
            
            const properties =await this.propertiesRepository.findOne({ id: PathParams.id });
            console.log(properties?.propertyLockFile);
            const events = await ical.async.fromURL(properties?.propertyLockFile);
            let eventsList: any = Object.values(events);
            let summaryList     = [];
            
           
            for (const event of eventsList) {
                if (event && event.type == "VEVENT") {

                    let summaryObj = event.summary.split('; ');
                    let customerName =  summaryObj[0].split('  (');
                   let otherInfo = '';
                  
                    if(typeof summaryObj[5] != 'undefined') {
                         otherInfo = summaryObj[5];
                    }
                  
                    var log = {
                    startDate : event.start.toISOString(),
                    endDate : event.end.toISOString(),
                    customerName : customerName[0],
                    email:summaryObj[3],
                    roomName:summaryObj[2],
                    contactNumber:summaryObj[4],
                    otherInfo:otherInfo
                    }
                    summaryList.push(log);
                }
            }
            if (Array.isArray(summaryList) && summaryList.length)
            {
            return {
                success: true,
                code   : 200,
                message: 'Auto fill data has been retrieved.',
                data   : {
                    icalData: summaryList
                }
            };}
            else {
                return {
                    success: true,
                    code   : 404,
                    message: 'Auto fill data has been not retrieved.',
                    data   : {
                        icalData: summaryList
                    }
                }  
            }
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
                message: error.message || 'Something went wrong. Please contact support team.',
            };
        }
    }
}
