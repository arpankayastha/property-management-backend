import {EntityRepository, getRepository, Repository} from "typeorm";
import {User} from "../entities/User";

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
    private userModel;

    constructor() {
        super();
        this.userModel = getRepository(User);
    }

    async findByID(id: string): Promise<User | undefined> {
        return await this.userModel.findOne(id,
            {
                loadRelationIds: false,
            });
    }
}
