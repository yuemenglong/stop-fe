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

app.get("/favicon.ico", (req, res) => {
    res.status(404).end()
});

app.ajaxPost("/user/login", transmit);
app.ajaxGet("/user/logout", transmit);

app.ajaxPost("/teacher/course", transmit);
app.ajaxGet("/teacher/course/:id", transmit);
app.ajaxPut("/teacher/course/:id", transmit);
app.ajaxGet("/teacher/course/list", transmit);
app.ajaxGet("/teacher/course/count", transmit);
app.ajaxDelete("/teacher/course/:id", transmit);

app.ajaxPost("/teacher/course/:id/courseware", transmit);
app.ajaxPut("/teacher/course/:id/courseware/:cid", transmit);
app.ajaxPost("/teacher/course/:id/video", transmit);
app.ajaxPut("/teacher/course/:id/video/:vid", transmit);
app.ajaxPost("/teacher/course/:id/question", transmit);
app.ajaxGet("/teacher/course/:id/question/:qid", transmit);
app.ajaxPut("/teacher/course/:id/question/:qid", transmit);
app.ajaxDelete("/teacher/course/:id/courseware/:cid", transmit);
app.ajaxDelete("/teacher/course/:id/video/:vid", transmit);
app.ajaxDelete("/teacher/course/:id/question/:qid", transmit);

app.ajaxPost("/teacher/student", transmit);
app.ajaxDelete("/teacher/student/:id", transmit);
app.ajaxPut("/teacher/student/:id", transmit);
app.ajaxGet("/teacher/student/:id", transmit);
app.ajaxGet("/teacher/student/list", transmit);
app.ajaxGet("/teacher/student/count", transmit);

app.ajaxPost("/teacher/clazz", transmit);
app.ajaxDelete("/teacher/clazz/:id", transmit);
app.ajaxPut("/teacher/clazz/:id", transmit);
app.ajaxGet("/teacher/clazz/:id", transmit);
app.ajaxGet("/teacher/clazz/:id/students", transmit);
app.ajaxPost("/teacher/clazz/:id/students", transmit);
app.ajaxDelete("/teacher/clazz/:id/student/:sid", transmit);
app.ajaxGet("/teacher/clazz/list", transmit);
app.ajaxGet("/teacher/clazz/count", transmit);

app.ajaxPost("/teacher/course-category", transmit);
app.ajaxPut("/teacher/course-category/:id", transmit);
app.ajaxGet("/teacher/course-category", transmit);
app.ajaxDelete("/teacher/course-category/:id", transmit);
app.ajaxPost("/teacher/question-category", transmit);
app.ajaxPut("/teacher/question-category/:id", transmit);
app.ajaxGet("/teacher/question-category", transmit);
app.ajaxDelete("/teacher/question-category/:id", transmit);

app.ajaxGet("/teacher/study-job/list", transmit);
app.ajaxGet("/teacher/study-job/count", transmit);
app.ajaxGet("/teacher/study-job/:id", transmit);
app.ajaxPost("/teacher/study-job", transmit);
app.ajaxPut("/teacher/study-job/:id", transmit);
app.ajaxDelete("/teacher/study-job/:id", transmit);

app.ajaxPost("/teacher/team", transmit);
app.ajaxDelete("/teacher/team/:tid", transmit);
app.ajaxPut("/teacher/team/:tid", transmit);
app.ajaxGet("/teacher/team/list", transmit);
app.ajaxGet("/teacher/team/count", transmit);
app.ajaxGet("/teacher/team/:tid", transmit);

let v = new Date().getTime();
app.httpGet("/*", (req, res) => {
    res.render("App.teacher.pug", {title: "攻防平台教师系统", v});
});
app.use(errorHandler);

// noinspection JSUnusedGlobalSymbols
export default () => {
    app.listen(PORT, (err: Error) => {
        console.log(err || `Start [PC] Succ On ${PORT}`)
    })
}