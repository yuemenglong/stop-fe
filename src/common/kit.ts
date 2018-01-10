import _ = require("lodash");
import {hideLoading, showLoading} from "./loading";

export function decodeObject(str: string): any {
    let obj = {};
    _(str).split("&").map(function (kv) {
        let kvs = kv.split("=");
        if (!kvs[0] || !kvs[1]) {
            return;
        }
        _.set(obj, decodeURIComponent(kvs[0]), decodeURIComponent(kvs[1]))
    }).value();
    return obj;
}

export function encodeObject(obj: any): string {
    function go(obj: any, res: string[], prefix: string) {
        let kv;
        if (obj == null) {
            kv = prefix + "=";
            res.push(kv)
        } else if (_.isArray(obj)) {
            obj.map(function (item, i) {
                const path = prefix + "[" + i + "]";
                go(item, res, path)
            })
        } else if (typeof obj == "object") {
            _(obj).keys().map(function (key) {
                const value = obj[key];
                const path = prefix ? prefix + "." + key : key;
                go(value, res, path)
            }).value()
        } else {
            kv = prefix + "=" + obj;
            res.push(kv)
        }
    }

    const res: string[] = [];
    const prefix = "";
    go(obj, res, prefix);
    return res.join("&");
}

export function match(cond, map) {
    let key = cond.toString();
    if (map[key] !== undefined) {
        return map[key];
    } else if (map["_"] !== undefined) {
        return map["_"];
    } else {
        throw Error("Unmatch For " + key)
    }
}

export function ajax(opt: any) {
    showLoading();
    opt = _.merge({contentType: 'application/json', dataType: 'json',}, opt);
    let error = opt.error;
    opt.error = ((err: any) => {
        if (err.status == "403") {
            location.href = "/login"
        }
        // ajax返回为空时，认为是有问题的（delete成功，可返回空对象）
        error ? error(err) : alert(err.responseText);
    });
    let complete = opt.complete || _.noop;
    opt.complete = () => {
        complete();
        hideLoading()
    };
    $.ajax(opt)
}

export function ajaxGet(url: String, success: Function, error?: Function) {
    let type = "GET";
    let opt = {url, type, success, error};
    return ajax(opt);
}

export function ajaxPost(url: String, data: any, success: Function, error?: Function) {
    if (!_.isString(data)) {
        data = JSON.stringify(data)
    }
    let type = "POST";
    let opt = {url, type, data, success, error};
    return ajax(opt);
}

export function ajaxPut(url: String, data: any, success: Function, error?: Function) {
    if (!_.isString(data)) {
        data = JSON.stringify(data)
    }
    let type = "PUT";
    let opt = {url, type, data, success, error};
    return ajax(opt);
}

export function ajaxDelete(url: String, success: Function, error?: Function) {
    let type = "DELETE";
    let opt = {url, type, success, error};
    return ajax(opt);
}

export class Kit {
    static optionValueList(arr: Array<any>, optionField: string = "name", valueField: string = "id"): Array<{ value: string, option: string }> {
        if (arr == null) {
            return [];
        }
        let ret = arr.map(o => {
            return {value: o[valueField], option: o[optionField]}
        });
        ret.unshift({value: "", option: "请选择"})
        return ret;
    }

    static emptyStringToNull(obj: any) {
        if (_.isArray(obj)) {
            obj.map(Kit.emptyStringToNull)
        } else if (_.isPlainObject(obj)) {
            for (let name in obj) {
                if (_.isString(obj[name]) && obj[name] == "") {
                    obj[name] = null;
                } else {
                    Kit.emptyStringToNull(obj[name])
                }
            }
        }
    }

    static randomId() {
        return (Math.random() * 10000).toFixed(0) + "-" + (new Date().valueOf().toString()).slice(-5)
    }
}
