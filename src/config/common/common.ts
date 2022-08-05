import config from "../config";
// @ts-ignore
import * as jwt from "jsonwebtoken";
// @ts-ignore
import {getRepository, Repository} from "typeorm";
import {User} from "../../entities/User";
import {LocksRepository} from "../../repositories/LocksRepository";

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

export async function getTokenForReservationAPI() {
    let authTokenObj = await new LocksRepository().postData('https://api.sciener.com/oauth2/token', {
        client_id    : 'e4336fa2848b43f6ae756dedebb7608c',
        client_secret: '630d8a7ae710b209d5f0ba73551ae5d9',
        username     : 'info@babyquailinn.com',
        password     : 'f8ba5c175519ef382ece556b167d4329'
    });

    if (authTokenObj) {
        return authTokenObj.access_token;
    }

    return null;
}

export async function parseICSFile() {
    //http://v2.reservationkey.com/p/api/icalendar/export.ics?i=87892&r=295303&f=0
    const events = await ical.async.fromURL('https://v2.reservationkey.com/p/api/icalendar/export.ics?i=87892&r=295770&f=0&gf=1&gl=1&id=1&unit=1&ge=1&gp=1');

    let eventsList: any = Object.values(events);
    return eventsList;
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