import axios from "axios";
import moment from "moment/moment";

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
        return this.postRequestOptions;
        // let postLockRequest          = await axios.post(url, this.postRequestOptions);
        // if (postLockRequest) {
        //     return postLockRequest.data;
        // }
        // return [];
    }

    async addNewPasswordToLock(params: any) {
        await this.postData('https://api.sciener.com/v3/keyboardPwd/add', {
            clientId       : 'e4336fa2848b43f6ae756dedebb7608c',
            accessToken    : '116ad564818d713d69d025eba52c976d',
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

