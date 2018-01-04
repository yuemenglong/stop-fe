import * as express from "express";
import * as P from "path";
import {ApplicationEx, extendApplication} from "./kit/extend-app";
import {Transmit} from "./handler/transmit";
import cookieParser = require("cookie-parser");
import {errorHandler} from "./handler/error-handler";
import {userConf} from "./conf/conf";
import {Upload} from "./handler/upload";

let logger = require("yy-logger");

const BASEDIR = P.resolve(__dirname, "../..");
const PORT = userConf.port;

let app: ApplicationEx = extendApplication(express());

let transmit = Transmit(userConf.transmitHost, userConf.transmitPort);

process.on('uncaughtException', function (err) {
    logger.error(err.stack)
});

app.set('view engine', 'pug');
app.use(cookieParser());
app.use("/deploy", express.static(P.resolve(BASEDIR, "deploy")));
app.use("/upload", express.static(userConf.uploadPath));
app.post("/upload", Upload(userConf.uploadPath, "file"));
app.use("/target", express.static(userConf.targetPath));
app.use("/memberfiles", express.static(userConf.uploadPath));

app.get("/favicon.ico", (req, res) => {
    res.status(404).end()
});

app.ajaxPost("/user/login", transmit);
app.ajaxGet("/user/logout", transmit);

app.ajaxGet("/user/:uid", transmit);
app.ajaxPut("/user/:uid", transmit);

app.ajaxGet("/user/:uid/study-job", transmit);
app.ajaxGet("/user/:uid/study-job/:id", transmit);
app.ajaxGet("/user/:uid/study-job/:sid/item/:id", transmit);
app.ajaxGet("/user/:uid/study-job/:sid/courseware/:id", transmit);
app.ajaxGet("/user/:uid/study-job/:sid/video/:id", transmit);
app.ajaxGet("/user/:uid/study-job/:sid/question/:id", transmit);
app.ajaxPost("/user/:uid/study-job/:sid/question/:id", transmit);

// app.ajaxPost("/teacher/team", transmit);
// app.ajaxDelete("/teacher/team/:tid", transmit);
// app.ajaxPut("/teacher/team/:tid", transmit);
// app.ajaxGet("/teacher/team/list", transmit);
// app.ajaxGet("/teacher/team/count", transmit);
// app.ajaxGet("/teacher/team/:tid", transmit);

app.ajaxPost("/user/:uid/team", transmit);// 加入team
app.ajaxPut("/user/:uid/team", transmit);// 加入team
app.ajaxDelete("/user/:uid/team", transmit);//退出
app.ajaxGet("/user/:uid/team", transmit);// team详情
app.ajaxPut("/user/:uid/team/students/:aid", transmit);// 操作加入申请

app.ajaxGet("/user/:uid/quiz-job/list", transmit);
app.ajaxGet("/user/:uid/quiz-job/count", transmit);
app.ajaxGet("/user/:uid/quiz-job/:jid", transmit);
app.ajaxPut("/user/:uid/quiz-job/:jid/items/:id", transmit);
app.ajaxPut("/user/:uid/quiz-job/:jid", transmit);

app.ajaxGet("/teacher/team/list", transmit);// team列表
app.ajaxGet("/admin/category", transmit);//
app.ajaxGet("/admin/courseware/list", transmit);//
app.ajaxGet("/admin/courseware/count", transmit);//
app.ajaxGet("/admin/video/list", transmit);//
app.ajaxGet("/admin/video/count", transmit);//
app.ajaxGet("/admin/target/list", transmit);//
app.ajaxGet("/admin/target/count", transmit);//

let v = new Date().getTime();
app.httpGet("/*", (req, res) => {
    res.render("user.pug", {title: "攻防平台", v});
});
app.use(errorHandler);

// noinspection JSUnusedGlobalSymbols
export default () => {
    app.listen(PORT, (err: Error) => {
        console.log(err || `Start [User] Succ On ${PORT}`)
    })
}