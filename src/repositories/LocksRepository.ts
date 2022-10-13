import axios from "axios";
import moment from "moment/moment";
import {Property} from "../entities/Property";

export class LocksRepository {

    public getRequestOptions = {
        method : 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    public postRequestOptions = {
        method : 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body   : ''
    };

    async getList(url: string, urlQueryParams: any): Promise<any> {
        let lockListData = await axios.get(url + '?' + new URLSearchParams(urlQueryParams), this.getRequestOptions);
        if (lockListData) {
            return lockListData.data;
        }
        return [];
    }

    async getDetail(url: string, urlQueryParams: any): Promise<any> {
        let lockDetailData = await axios.get(url + '?' + new URLSearchParams(urlQueryParams), this.getRequestOptions);
        if (lockDetailData) {
            return lockDetailData.data;
        }

        return [];
    }

    async postData(url: string, values: any): Promise<any> {
        this.postRequestOptions.body = JSON.stringify(values);
        console.log('this.postRequestOptions', this.postRequestOptions);
        console.log({url});
        //return this.postRequestOptions;
        try {
            let postLockRequest = await axios.post(url, this.postRequestOptions);
            console.log({postLockRequest});
            if (postLockRequest) {
                return postLockRequest.data;
            }
        } catch (e) {
            throw new Error(e.message);
        }
        return null;
    }

    async addNewPasswordToLock(params: any) {
        let propertyDetails = await Property.findOne(params.propertyId);
        params.lockId       = (propertyDetails) ? propertyDetails.propertyId : 0;
        return await this.postData('https://api.sciener.com/v3/keyboardPwd/add', {
            clientId       : 'e4336fa2848b43f6ae756dedebb7608c',
            accessToken    : '258473f8fe22a8e1637815a25c200d5c',
            lockId         : params.lockId,
            keyboardPwd    : params.passcode,
            keyboardPwdName: params.name,
            startDate      : params.startDate,
            endDate        : params.endDate,
            addType        : 2,
            date           : moment().valueOf()
        })
    }
}

