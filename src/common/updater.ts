import * as _ from "lodash";

export class Updater {
    prev: Updater = null;

    path: string;
    value: any;
    pathArgs: any[];

    constructor(path: string, value: any, pathArgs: any[] = []) {
        this.path = path;
        this.value = value;
        this.pathArgs = pathArgs;
    }

    update(path: string, value: any, pathArgs: any[] = []): Updater {
        let builder = new Updater(path, value, pathArgs);
        builder.prev = this;
        return builder;
    }

    call(obj: Object): any {
        if (this.prev) {
            obj = this.prev.call(obj)
        }
        return update(obj, this.path, this.value, this.pathArgs);
    }
}

export function update(obj: Object, path: string, value: any, pathArgs: any[] = []): any {
    function go(obj: Object, paths: string[], value: any, pathArgs: any[]): Object {
        if (obj == null) {
            throw Error("Can't Merge Obj If Is Null")
        }
        let name = paths[0];
        // 数组替换
        let matchArrReplace = name.match(/(.+)\[(.+)]/);
        // 数组追加
        let matchArrAppend = name.match(/(.+)\[]/);
        // 数组删除
        let matchArrDelete = name.match(/(.+)\[-(.*)]/);
        // 对象合并
        let matchObjMerge = name.match(/(.+){}/);
        // 数组中对象合并
        let matchArrObjMerge = name.match(/(.+)\[(.+)]{}/);
        // 都不是就是对象或字段替换
        if (matchArrObjMerge) {
            // 数组对象merge
            name = matchArrObjMerge[1];
            let condName = matchArrObjMerge[2];
            let condValue = pathArgs[0];
            let idx = null;
            if (condName == "$idx") {
                idx = condValue
            } else {
                idx = _.findIndex(obj[name], (item) => item[condName] == condValue);
            }
            if (idx < 0) throw Error("Can't Find Item In Array: " + paths + " -- " + condValue)
            let oldValue = obj[name][idx];
            let newValue: null;
            if (paths.length > 1) throw Error("Merge Must At End");
            newValue = _.defaults({}, value, oldValue);
            let newArr = _.clone(obj[name]);
            newArr[idx] = newValue;
            let merge = {};
            merge[name] = newArr;
            return _.defaults(merge, obj);
        } else if (matchArrDelete) {
            // 数组删除
            let arrName = matchArrDelete[1];
            let arrValue = obj[arrName];
            let condName = matchArrDelete[2];
            let condValue = pathArgs[0];
            let newValue = arrValue.filter(item => item[condName] != condValue);
            if (value != null) throw Error("Delete Array Item Not Need Value");
            if (pathArgs.length == 0) throw Error("No Cond");
            if (paths.length > 1) throw Error("Delete Array Item Must At End");
            let merge = {};
            merge[arrName] = newValue;
            return _.defaults(merge, obj);
        } else if (matchArrReplace) {
            // 数组替换
            if (pathArgs.length == 0) throw  Error("Path Args Not Match");
            name = matchArrReplace[1];
            let condName = matchArrReplace[2];
            let condValue = pathArgs[0];
            let idx = null;
            if (condName == "$idx") {
                idx = condValue
            } else {
                idx = _.findIndex(obj[name], (item) => item[condName] == condValue);
            }
            if (idx < 0) {
                throw Error("Can't Find Item In Array: " + paths + " -- " + condValue)
            }
            let oldValue = obj[name][idx];
            let newValue = null;
            if (paths.length > 1) {
                newValue = go(oldValue, paths.slice(1), value, pathArgs.slice(1));
            } else {
                newValue = value;
            }
            let newArr = _.clone(obj[name]);
            newArr[idx] = newValue;
            let merge = {};
            merge[name] = newArr;
            return _.defaults(merge, obj);
        } else if (matchArrAppend) {
            // 数组追加
            if (paths.length != 1) throw Error("Append Array Item Must At End Of Path");
            let name = matchArrAppend[1];
            let arr = obj[name].concat([value]);
            let merge = {};
            merge[name] = arr;
            return _.defaults(merge, obj);
        } else if (!matchObjMerge) {
            // 对象替换
            let oldValue = obj[name];
            let newValue = null;
            if (paths.length > 1) {
                newValue = go(oldValue, paths.slice(1), value, pathArgs);
            } else {
                newValue = value;
            }
            let merge = {};
            merge[name] = newValue;
            return _.defaults(merge, obj);
        } else {
            // 对象合并
            let name = matchObjMerge[1];
            let oldValue = obj[name];
            let newValue = null;
            if (paths.length > 1) {
                throw Error("Merge Must At End")
            } else {
                newValue = _.defaults({}, value, oldValue);
            }
            let merge = {};
            merge[name] = newValue;
            return _.defaults(merge, obj);
        }
    }

    return go(obj, path.split("."), value, pathArgs)
}

export function updates(path: string, value: any, pathArgs: any[] = []): Updater {
    return new Updater(path, value, pathArgs)
}