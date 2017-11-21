import * as http from "http";
import {formatRequest, formatResponse} from "../kit/format";
import * as _ from "lodash";
import {IncomingHttpHeaders} from "http";
import {Request, Response} from "express";

let logger = require("yy-logger");
let iconv = require("iconv-lite");

function getMessage(status: number) {
    return `后台服务出错(${status})，请按F5刷新后重试`;
}

// 转为标准err对象
function error(body: string, status: number) {
    try {
        let json = JSON.parse(body);
        let err = new Error(json.name);
        _.merge(err, json);
        return err;
    } catch (ex) {
        let err = new Error("ERROR_" + status);
        err.message = getMessage(status);
        return err;
    }
}

export type TransmitCallback = (err: Error,
                                body: string,
                                headers?: IncomingHttpHeaders,
                                status?: number) => void;

export interface TransmitOpt {
    path?: string,
}

export function Transmit(host: string, port: number, fn?: TransmitCallback, opt?: TransmitOpt) {
    opt = opt || {};
    return function (req: Request, res: Response) {
        function errorHandler(err: Error) {
            logger.error(JSON.stringify(err.stack));
            res.status(500).end(JSON.stringify({name: err.name, message: err.message}));
        }

        let resBuf: Buffer[] = [];
        let options = _.merge({
            hostname: host,
            port: port,
            path: req.originalUrl,
            method: req.method,
            headers: req.headers,
        }, opt);
        let backendReq = http.request(options, function (backendRes) {
            backendRes.on("data", function (data: Buffer) {
                resBuf.push(data);
            });
            backendRes.on("end", function () {
                let raw = Buffer.concat(resBuf);
                let bin = (backendRes.headers["content-type"] as string || "").match(/jpeg/);
                let body = bin ? "" : iconv.decode(raw, "utf8");
                // 处理出错的情况
                if (backendRes.statusCode >= 400) {
                    (req as any)._originalUrl = opt.path; // 为了打日志
                    logger.error(formatResponse(req, backendRes, body));
                    if (fn) {
                        return fn(error(body, backendRes.statusCode), null, backendRes.headers, backendRes.statusCode);
                    }
                    try {
                        let err = JSON.parse(body);
                        return res.status(backendRes.statusCode).header(backendRes.headers).json(err)
                    } catch (ex) {
                        return res.status(backendRes.statusCode).end(JSON.stringify({
                            name: "BACKEND_ERROR",
                            message: getMessage(backendRes.statusCode)
                        }));
                    }
                }
                (req as any)._originalUrl = opt.path; // 为了打日志
                logger.info(formatResponse(req, backendRes, body));
                // 处理重定向的情况
                if (Math.floor(backendRes.statusCode / 100) == 3) {
                    res.writeHead(backendRes.statusCode, backendRes.headers);
                    return res.end();
                }
                // 提供了回调函数
                if (fn) {
                    return fn(null, body, backendRes.headers, backendRes.statusCode);
                }
                // 没有提供回调函数的情况下默认透回去
                res.writeHead(backendRes.statusCode, backendRes.headers);
                // 处理bin的情况
                if (bin) {
                    return res.end(raw);
                } else {
                    return res.end(body);
                }
            });
            backendRes.on("error", errorHandler);
        });
        req.on("error", errorHandler);
        res.on("error", errorHandler);
        backendReq.on("error", errorHandler);
        //
        (req as any)._originalUrl = opt.path; // 为了打日志
        logger.info(formatRequest(req, JSON.stringify(req.body)));
        req.pipe(backendReq);
        // backendReq.end(JSON.stringify(req.body));
    };
}

// module.exports = Transmit;
