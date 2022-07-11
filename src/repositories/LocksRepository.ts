import axios from "axios";

export class LocksRepository {

    public getRequestOptions = {
        method : 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
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
}

