import {EntityRepository, getRepository, Repository} from "typeorm";
import {Hotel} from "../entities/Hotel";

@EntityRepository(Hotel)
export class HotelsRepository extends Repository<Hotel> {
    private hotelModel;

    constructor() {
        super();
        this.hotelModel = getRepository(Hotel);
    }

    async findAll(requestData: any): Promise<[Hotel[], number]> {
        const limit           = (+requestData.pageNumber - 1) * +requestData.sizePerPage;
        const search          = requestData.search ? requestData.search : '';
        requestData.sortOrder = requestData.sortOrder == 'null' ? 'DESC' : requestData.sortOrder;
        requestData.sortField = requestData.sortField == 'null' ? 'id' : requestData.sortField;

        let hotels_query = this.hotelModel.createQueryBuilder('hotel')
            .orderBy("hotel." + requestData.sortField, requestData.sortOrder.toUpperCase())
            .take(requestData.pageSize)
            .skip(limit);

        if (search) {
            hotels_query = hotels_query.where("hotel.name LIKE '%" + search + "%'");
        }
        return await hotels_query.getManyAndCount();
    }

    async findByID(id: string, relations: string[]): Promise<Hotel | undefined> {
        return await this.hotelModel.findOne(id,
            {
                relations      : relations,
                loadRelationIds: false,
            });
    }
}
