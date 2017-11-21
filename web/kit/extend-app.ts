import {Application, Request, Response} from "express";

export type ExpressHandler = (req: Request, res: Response, next?: Function) => void;

export interface ApplicationEx extends Application {
    httpGet(url: string, fn: ExpressHandler, ...fns: ExpressHandler[]): void

    httpPost(url: string, fn: ExpressHandler, ...fns: ExpressHandler[]): void

    httpPut(url: string, fn: ExpressHandler, ...fns: ExpressHandler[]): void

    httpDelete(url: string, fn: ExpressHandler, ...fns: ExpressHandler[]): void

    ajaxGet(url: string, fn: ExpressHandler, ...fns: ExpressHandler[]): void

    ajaxPost(url: string, fn: ExpressHandler, ...fns: ExpressHandler[]): void

    ajaxPut(url: string, fn: ExpressHandler, ...fns: ExpressHandler[]): void

    ajaxDelete(url: string, fn: ExpressHandler, ...fns: ExpressHandler[]): void
}

export function extendApplication(app: Application): ApplicationEx {
    let ex: any = app;
    ex.httpGet = (url: string, fn: ExpressHandler, ...fns: ExpressHandler[]) => {
        app.get(url, (req: Request, res: Response, next: Function) => {
            if (!req.xhr && req.method == "GET") return fn(req, res, next);
            else return next();
        }, fns)
    };
    ex.httpPost = (url: string, fn: ExpressHandler, ...fns: ExpressHandler[]) => {
        app.post(url, (req: Request, res: Response, next: Function) => {
            if (!req.xhr && req.method == "POST") return fn(req, res, next);
            else return next();
        }, fns)
    };
    ex.httpPut = (url: string, fn: ExpressHandler, ...fns: ExpressHandler[]) => {
        app.put(url, (req: Request, res: Response, next: Function) => {
            if (!req.xhr && req.method == "PUT") return fn(req, res, next);
            else return next();
        }, fns)
    };
    ex.httpDelete = (url: string, fn: ExpressHandler, ...fns: ExpressHandler[]) => {
        app.delete(url, (req: Request, res: Response, next: Function) => {
            if (!req.xhr && req.method == "DELETE") return fn(req, res, next);
            else return next();
        }, fns)
    };
    ex.ajaxGet = (url: string, fn: ExpressHandler, ...fns: ExpressHandler[]) => {
        app.get(url, (req: Request, res: Response, next: Function) => {
            if (req.xhr && req.method == "GET") return fn(req, res, next);
            else return next();
        }, fns)
    };
    ex.ajaxPost = (url: string, fn: ExpressHandler, ...fns: ExpressHandler[]) => {
        app.post(url, (req: Request, res: Response, next: Function) => {
            if (req.xhr && req.method == "POST") return fn(req, res, next);
            else return next();
        }, fns)
    };
    ex.ajaxPut = (url: string, fn: ExpressHandler, ...fns: ExpressHandler[]) => {
        app.put(url, (req: Request, res: Response, next: Function) => {
            if (req.xhr && req.method == "PUT") return fn(req, res, next);
            else return next();
        }, fns)
    };
    ex.ajaxDelete = (url: string, fn: ExpressHandler, ...fns: ExpressHandler[]) => {
        app.delete(url, (req: Request, res: Response, next: Function) => {
            if (req.xhr && req.method == "DELETE") return fn(req, res, next);
            else return next();
        }, fns)
    };
    return ex;
}
