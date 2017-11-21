import * as P from "path";
import * as fs from "fs";
import * as formidable from "formidable";
import * as moment from "moment";
import * as uuid from "node-uuid";
import * as _ from "lodash";

function exists(path: string) {
    try {
        fs.statSync(path); //同步版的stat，返回一个stat数组对象
        return true;
    } catch (err) {
        return false;
    }
}

function mkdir(path: string) {
    if (exists(path)) {
        return;
    }
    let dir = P.parse(path).dir;
    if (dir) {
        mkdir(dir);
    }
    fs.mkdirSync(path);
}

export function Upload(path: string, fileName: string, cb?: any) {
    mkdir(path);
    return function (req: any, res: any, next: any) {
        if (req.method !== "POST") {
            return next();
        }
        let form = new formidable.IncomingForm();
        form.encoding = 'utf-8';
        form.uploadDir = path;
        form.keepExtensions = true;
        form.maxFieldsSize = 8 * 1024 * 1024;
        form.parse(req, function (err, fields, files) {
            if (err || !files[fileName]) {
                return res.status(500).json({name: "UPLOAD_ERROR", message: _.get(err, 'message')});
            }
            let dir = moment().format("YYYYMMDD");
            let id = dir + "/" + moment().format("YYYYMMDD-HHmmss-") + uuid.v4() + P.extname(files[fileName].name);
            mkdir(P.resolve(path, dir));
            let newPath = P.resolve(path, id)
            fs.renameSync(files[fileName].path, newPath);
            if (!cb) {
                res.end(id)
            } else {
                cb(id, res)
            }
        })
    }
}

