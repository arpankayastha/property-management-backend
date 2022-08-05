import {Property} from "../../entities/Property";
import {IsNull} from "typeorm";

export const generateLockPasswords = async () => {
    let lockList = await Property.find({
        where: {
            propertyLockFile: !IsNull()
        }
    });

    if (lockList) {
        //
    }

    return lockList;
}

