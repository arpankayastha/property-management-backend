import axios from "axios";
import moment from "moment/moment";
import qs from "qs";
import { Property } from "../entities/Property";

export class LocksRepository {

    public getRequestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    public postRequestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: ''
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
       // this.postRequestOptions.data = qs.stringify(values);
        console.log('this.postRequestOptions', this.postRequestOptions);
        console.log({ url });

        //return this.postRequestOptions;
        try {
            let postLockRequest = await axios.post(url,qs.stringify(values),this.postRequestOptions)
           //  let postLockRequest = await axios.post(url, this.postRequestOptions);
            // let postLockRequest = await axios.post(url, JSON.stringify(values));
            //  console.log({postLockRequest});
            console.log(postLockRequest)
            if (postLockRequest) {
                return postLockRequest.data;
            }
        } catch (e) {
             console.log(e)
            throw new Error(e.message);

        }

         return null;
    }

    async addNewPasswordToLock(params: any) {
        let propertyDetails = await Property.findOne(params.propertyId);
        params.type = (params.gateway==true) ? 2 : 1;
        params.lockId = (propertyDetails) ? propertyDetails.propertyId : 0;
        return await this.postData('https://api.sciener.com/v3/keyboardPwd/add', {
            clientId: 'e4336fa2848b43f6ae756dedebb7608c',
            accessToken: process.env.TOKEN,
            lockId         : params.lockId,
            keyboardPwd    : params.passcode,
            keyboardPwdName: params.name,
            startDate      : params.startDate,
            endDate        : params.endDate,
            addType        : params.type,
            date           : moment().valueOf()
        //     lockId: 7084100,
        //     keyboardPwd: 9371,
        //   //  keyboardPwdName: 'Raj Patel',
        //     startDate: 1671171300000,
        //     endDate: 1673849700000,
           // addType: 1,
            //date: moment().valueOf()
        })
    }
}

