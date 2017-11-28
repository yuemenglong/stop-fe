import * as express from "express";
import * as P from "path";
import {ApplicationEx, extendApplication} from "./kit/extend-app";
import {Transmit} from "./handler/transmit";
import cookieParser = require("cookie-parser");
import {errorHandler} from "./handler/error-handler";
import {conf} from "./conf/conf";
import {Upload} from "./handler/upload";

let logger = require("yy-logger");

const BASEDIR = P.resolve(__dirname, "../..");
const PORT = conf.port;

let app: ApplicationEx = extendApplication(express());

let transmit = Transmit(conf.transmitHost, conf.transmitPort);

process.on('uncaughtException', function (err) {
    logger.error(err.stack)
});

app.set('view engine', 'pug');
app.use(cookieParser());
app.use("/deploy", express.static(P.resolve(BASEDIR, "deploy")));
app.use("/upload", express.static(conf.uploadPath));
app.post("/upload", Upload(conf.uploadPath, "file"));
app.use("/memberfiles", express.static(conf.uploadPath));

app.get("/favicon.ico", (req, res) => {
    res.status(404).end()
});

app.ajaxPost("/course", transmit);
app.ajaxGet("/course/:id", transmit);
app.ajaxPut("/course/:id", transmit);
app.ajaxGet("/course/list", transmit);
app.ajaxGet("/course/count", transmit);
app.ajaxDelete("/course/:id", transmit);
app.ajaxPost("/course/:id/courseware", transmit);
app.ajaxPost("/course/:id/video", transmit);
app.ajaxPost("/course/:id/question", transmit);
app.ajaxGet("/course/:id/question/:qid", transmit);
app.ajaxPut("/course/:id/question/:qid", transmit);
app.ajaxDelete("/course/:id/courseware/:cid", transmit);
app.ajaxDelete("/course/:id/video/:vid", transmit);
app.ajaxDelete("/course/:id/question/:qid", transmit);

let v = new Date().getTime();
app.httpGet("/*", (req, res) => {
    res.render("App.pug", {title: "攻防平台", v});
});
app.use(errorHandler);

// noinspection JSUnusedGlobalSymbols
export default () => {
    app.listen(PORT, (err: Error) => {
        console.log(err || `Start [PC] Succ On ${PORT}`)
    })
}