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
app.ajaxPut("/course/:id/courseware/:cid", transmit);
app.ajaxPost("/course/:id/video", transmit);
app.ajaxPut("/course/:id/video/:vid", transmit);
app.ajaxPost("/course/:id/question", transmit);
app.ajaxGet("/course/:id/question/:qid", transmit);
app.ajaxPut("/course/:id/question/:qid", transmit);
app.ajaxDelete("/course/:id/courseware/:cid", transmit);
app.ajaxDelete("/course/:id/video/:vid", transmit);
app.ajaxDelete("/course/:id/question/:qid", transmit);

app.ajaxPost("/student", transmit);
app.ajaxDelete("/student/:id", transmit);
app.ajaxPut("/student/:id", transmit);
app.ajaxGet("/student/:id", transmit);
app.ajaxGet("/student/list", transmit);
app.ajaxGet("/student/count", transmit);

app.ajaxPost("/clazz", transmit);
app.ajaxDelete("/clazz/:id", transmit);
app.ajaxPut("/clazz/:id", transmit);
app.ajaxGet("/clazz/:id", transmit);
app.ajaxGet("/clazz/:id/students", transmit);
app.ajaxPost("/clazz/:id/students", transmit);
app.ajaxDelete("/clazz/:id/student/:sid", transmit);
app.ajaxGet("/clazz/list", transmit);
app.ajaxGet("/clazz/count", transmit);

app.ajaxPost("/course-category", transmit);
app.ajaxPut("/course-category/:id", transmit);
app.ajaxGet("/course-category", transmit);
app.ajaxDelete("/course-category/:id", transmit);
app.ajaxPost("/question-category", transmit);
app.ajaxPut("/question-category/:id", transmit);
app.ajaxGet("/question-category", transmit);
app.ajaxDelete("/question-category/:id", transmit);

app.ajaxGet("/study-job/list", transmit);
app.ajaxGet("/study-job/count", transmit);
app.ajaxGet("/study-job/:id", transmit);
app.ajaxPost("/study-job", transmit);
app.ajaxPut("/study-job/:id", transmit);
app.ajaxDelete("/study-job/:id", transmit);

app.ajaxGet("/user/:uid/study-job", transmit);
app.ajaxGet("/user/:uid/study-job/:id", transmit);
app.ajaxGet("/user/:uid/study-job/:sid/item/:id", transmit);
app.ajaxGet("/user/:uid/study-job/:sid/courseware/:id", transmit);
app.ajaxGet("/user/:uid/study-job/:sid/video/:id", transmit);
app.ajaxGet("/user/:uid/study-job/:sid/question/:id", transmit);
app.ajaxPost("/user/:uid/study-job/:sid/question/:id", transmit);

app.ajaxPost("/team", transmit);
app.ajaxDelete("/team/:tid", transmit);
app.ajaxPut("/team/:tid", transmit);
app.ajaxGet("/team/list", transmit);
app.ajaxGet("/team/count", transmit);
app.ajaxGet("/team/:tid", transmit);

app.ajaxPut("/user/:uid/team", transmit);// 加入team
app.ajaxDelete("/user/:uid/team", transmit);//退出
app.ajaxGet("/user/:uid/team", transmit);// team详情
app.ajaxPut("/user/:uid/team/students/:aid", transmit);// 操作加入申请

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