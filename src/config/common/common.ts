import config from "../config";
// @ts-ignore
import * as jwt from "jsonwebtoken";
// @ts-ignore
import {getRepository, Repository} from "typeorm";
import {User} from "../../entities/User";

const ical = require('node-ical');

export function generateJWTToken(user: any) {
    return jwt.sign({
        userId: user.id,
        email : user.email
    }, config.jwtSecret, {expiresIn: "7d"});
}

export function getInitials(name: any) {
    name = !!name ? name.split(" ") : ["Amigo", "Amigo"];
    if (name.length > 2) {
        name = [name[0], name[name.length - 1]];
    }
    return name.length > 1
        ? name[0].substring(0, 1).toUpperCase() +
        name[1].substring(0, 1).toUpperCase()
        : name[0].substring(0, 1).toUpperCase();
}

export const getAuthRepository = (headerParams: any) => {
    return getRepository(User);
}

export async function getAuthUserDetails(authRepository: Repository<any>, headerParams: any) {
    return await authRepository.findOne({
        loadRelationIds: true,
        where          : {
            id           : headerParams.user_id,
            session_token: headerParams.authorization
        }
    });
}

export async function parseICSFile() {
    //http://v2.reservationkey.com/p/api/icalendar/export.ics?i=87892&r=295303&f=0
    const events = await ical.async.fromURL('http://localhost:8083/uploads/room-data.ics');

    let eventsList: any = Object.values(events);
    let summaryList     = [];
    for (const event of eventsList) {
        if (event && event.type == "VEVENT") {
            let summaryObj = event.summary.split('; ');
            for (let content of summaryObj) {
                summaryList.push(content.split(': '));
            }
        }
    }
    return summaryList;
}