import {EntityRepository, getRepository, Repository} from "typeorm";
import {Property} from "../entities/Property";

@EntityRepository(Property)
export class PropertiesRepository extends Repository<Property> {
    private propertyModel;

    constructor() {
        super();
        this.propertyModel = getRepository(Property);
    }

    async findByID(id: string): Promise<Property | undefined> {
        return await this.propertyModel.findOne(id,
            {
                loadRelationIds: false,
            });
    }
}
