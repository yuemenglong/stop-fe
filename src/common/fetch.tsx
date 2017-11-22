import * as URL from "url"
import * as _ from "lodash";
import {hideLoading, showLoading} from "./loading";

export class FetchItem {
    data: any;
    cb: Function;
}

const FETCH_TIMEOUT = 50;

export type FetchData = { [key: string]: FetchItem };
let g = global as any;

export class Fetch {

    static getFetchData(): FetchData {
        return g.FetchData
    }

    static setFetchData(data: FetchData) {
        g.FetchData = data;
    }

    static clear(url: string) {
        delete Fetch.getFetchData()[url];
    }

    static reset() {
        Fetch.setFetchData({});
    }

    static fetch(url: string, cb: Function) {
        url = decodeURIComponent(url);
        if (Fetch.getFetchData()[url] != null && Fetch.getFetchData()[url].data !== undefined) {
            // 已经fetch过并且拿到了数据
            return Fetch.getFetchData()[url].data;
        } else if (Fetch.getFetchData()[url] != null) {
            // 已经fetch过但是数据还没有拉回来
            return undefined;
        } else {
            // 没有fetch过，加入fetch
            Fetch.getFetchData()[url] = {cb, data: undefined};
            return undefined;
        }
    }

    static getFetchUrl(url: string, fetchData: FetchData = Fetch.getFetchData()): string {
        let decUrl = decodeURIComponent(url);
        // 后台将需要fetch的数据拼装成一个url
        let fetchArray = _(fetchData).toPairs().filter(([u, item]: [string, FetchItem]) => {
            return item.data === undefined && u != decUrl;
        }).map(([url, item]) => `"${url}"`).join(",");
        if (fetchArray.length) {
            let parsed = URL.parse(url);
            if (parsed.search) {
                return `${url}&__FETCH__=[${encodeURIComponent(fetchArray)}]`
            } else {
                return `${url}?__FETCH__=[${encodeURIComponent(fetchArray)}]`
            }
        } else {
            return url;
        }
    }

    static handleFetchResult(res: any, fetchData: FetchData = Fetch.getFetchData()) {
        _(res).toPairs().forEach(([url, data]) => {
            url = decodeURIComponent(url);
            if (!fetchData[url]) {
                fetchData[url] = {data: null, cb: null}
            }
            fetchData[url].data = data;
            if (g.window && fetchData[url].cb) {
                fetchData[url].cb(data);
            }
        })
    }
}

if (!g.window) {
    // 服务端
    g.FetchData = {} as FetchData;
} else {
    // 客户端
    fetchLoop()
}

function fetchLoop() {
    const fetchPrefix = "/FETCH";
    let url = Fetch.getFetchUrl(fetchPrefix);
    if (url === fetchPrefix) {
        return setTimeout(fetchLoop, FETCH_TIMEOUT)
    } else {
        let loading = showLoading();
        $.ajax({
            url: url,
            type: "GET",
            success: function (res) {
                Fetch.handleFetchResult(res)
                setTimeout(fetchLoop, FETCH_TIMEOUT)
            }, error: function (err) {
                window.alert("页面加载异常");
                console.log(err);
            }, complete: function () {
                hideLoading(loading);
            }
        })
    }
}

