import {EntityRepository, getRepository, Repository} from "typeorm";
import {Property} from "../entities/Property";

@EntityRepository(Property)
export class PropertiesRepository extends Repository<Property> {
    private propertyModel;

    constructor() {
        super();
        this.propertyModel = getRepository(Property);
    }

    async findAll(requestData: any): Promise<[Property[], number]> {
        const limit           = (+requestData.pageNumber - 1) * +requestData.sizePerPage;
        const search          = requestData.search ? requestData.search : '';
        requestData.sortOrder = requestData.sortOrder == 'null' ? 'DESC' : requestData.sortOrder;
        requestData.sortField = requestData.sortField == 'null' ? 'id' : requestData.sortField;

        let propety_query = this.propertyModel.createQueryBuilder('property')
            .leftJoinAndSelect('property.hotel', 'hotel')
            .orderBy("property." + requestData.sortField, requestData.sortOrder.toUpperCase())
            .take(requestData.pageSize)
            .skip(limit);

        if (search) {
            propety_query = propety_query.where("property.name LIKE '%" + search + "%'");
        }
        return await propety_query.getManyAndCount();
    }

    async findByID(id: string, relations: string[]): Promise<Property | undefined> {
        return await this.propertyModel.findOne(id,
            {
                relations      : relations,
                loadRelationIds: false,
            });
    }
}
