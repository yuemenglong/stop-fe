import _ = require("lodash");
import {hideLoading, showLoading} from "./loading";

export function decodeObject(str: string): Object {
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

export function encodeObject(obj: Object) {
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

export function joinClassName(propsClassName: string, defaultClassName: string) {
    return _.flattenDeep(arguments).join(" ");
}

export function ajax(opt: any) {
    let loading = showLoading();
    opt = _.merge({contentType: 'application/json', dataType: 'json',}, opt);
    opt.error = opt.error || ((err: any) => {
        // ajax返回为空时，认为是有问题的（delete成功，可返回空对象）
        alert(err.responseText);
    });
    let complete = opt.complete || _.noop;
    opt.complete = () => {
        complete();
        hideLoading(loading)
    };
    $.ajax(opt)
}