import * as express from "express";
import * as P from "path";
import {ApplicationEx, extendApplication} from "./kit/extend-app";
import {Transmit} from "./handler/transmit";
import cookieParser = require("cookie-parser");
import {errorHandler} from "./handler/error-handler";
import {teacherConf} from "./conf/conf";
import {Upload} from "./handler/upload";

let logger = require("yy-logger");

const BASEDIR = P.resolve(__dirname, "../..");
const PORT = teacherConf.port;

let app: ApplicationEx = extendApplication(express());

let transmit = Transmit(teacherConf.transmitHost, teacherConf.transmitPort);

process.on('uncaughtException', function (err) {
    logger.error(err.stack)
});

app.set('view engine', 'pug');
app.use(cookieParser());
app.use("/deploy", express.static(P.resolve(BASEDIR, "deploy")));
app.use("/upload", express.static(teacherConf.uploadPath));
app.post("/upload", Upload(teacherConf.uploadPath, "file"));

app.get("/favicon.ico", (req, res) => {
    res.status(404).end()
});

app.ajaxGet("/admin/category", transmit);
app.ajaxGet("/admin/courseware/list", transmit);
app.ajaxGet("/admin/courseware/count", transmit);
app.ajaxGet("/admin/video/list", transmit);
app.ajaxGet("/admin/video/count", transmit);
app.ajaxGet("/admin/question/list", transmit);
app.ajaxGet("/admin/question/count", transmit);

app.ajaxPost("/teacher/login", transmit);
app.ajaxGet("/teacher/logout", transmit);

app.ajaxPost("/teacher/course", transmit);
app.ajaxGet("/teacher/course/:id", transmit);
app.ajaxPut("/teacher/course/:id", transmit);
app.ajaxGet("/teacher/course/list", transmit);
app.ajaxGet("/teacher/course/count", transmit);
app.ajaxDelete("/teacher/course/:id", transmit);

app.ajaxGet("/teacher/course/:cid/courseware", transmit);
app.ajaxGet("/teacher/course/:cid/video", transmit);
app.ajaxGet("/teacher/course/:cid/question", transmit);

app.ajaxPut("/teacher/course/:cid/courseware", transmit);
app.ajaxPut("/teacher/course/:cid/video", transmit);
app.ajaxPut("/teacher/course/:cid/question", transmit);

app.ajaxDelete("/teacher/course/:cid/courseware/:id", transmit);
app.ajaxDelete("/teacher/course/:cid/video/:id", transmit);
app.ajaxDelete("/teacher/course/:cid/question/:id", transmit);

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
    res.render("teacher.pug", {title: "攻防平台教师系统", v});
});
app.use(errorHandler);

// noinspection JSUnusedGlobalSymbols
export default () => {
    app.listen(PORT, (err: Error) => {
        console.log(err || `Start [Teacher] Succ On ${PORT}`)
    })
}