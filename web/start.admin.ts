import * as express from "express";
import * as P from "path";
import {ApplicationEx, extendApplication} from "./kit/extend-app";
import {Transmit} from "./handler/transmit";
import cookieParser = require("cookie-parser");
import {errorHandler} from "./handler/error-handler";
import {adminConf} from "./conf/conf";
import {Upload} from "./handler/upload";

let logger = require("yy-logger");

const BASEDIR = P.resolve(__dirname, "../..");
const PORT = adminConf.port;

let app: ApplicationEx = extendApplication(express());

let transmit = Transmit(adminConf.transmitHost, adminConf.transmitPort);

process.on('uncaughtException', function (err) {
    logger.error(err.stack)
});

app.set('view engine', 'pug');
app.use(cookieParser());
app.use("/deploy", express.static(P.resolve(BASEDIR, "deploy")));
app.use("/upload", express.static(adminConf.uploadPath));
app.post("/upload", Upload(adminConf.uploadPath, "file"));
app.use("/memberfiles", express.static(adminConf.uploadPath));

app.get("/favicon.ico", (req, res) => {
    res.status(404).end()
});

app.ajaxPost("/admin/login", transmit);
app.ajaxGet("/admin/logout", transmit);

app.ajaxGet("/admin/category", transmit);
app.ajaxGet("/admin/course-category", transmit);
app.ajaxGet("/admin/courseware-category", transmit);
app.ajaxGet("/admin/video-category", transmit);
app.ajaxGet("/admin/question-category", transmit);

app.ajaxPost("/admin/course-category", transmit);
app.ajaxPost("/admin/courseware-category", transmit);
app.ajaxPost("/admin/video-category", transmit);
app.ajaxPost("/admin/question-category", transmit);

app.ajaxPut("/admin/course-category/:id", transmit);
app.ajaxPut("/admin/courseware-category/:id", transmit);
app.ajaxPut("/admin/video-category/:id", transmit);
app.ajaxPut("/admin/question-category/:id", transmit);

app.ajaxDelete("/admin/course-category/:id", transmit);
app.ajaxDelete("/admin/courseware-category/:id", transmit);
app.ajaxDelete("/admin/video-category/:id", transmit);
app.ajaxDelete("/admin/question-category/:id", transmit);

app.ajaxGet("/admin/course", transmit);
app.ajaxGet("/admin/courseware", transmit);
app.ajaxGet("/admin/video", transmit);
app.ajaxGet("/admin/question", transmit);

app.ajaxGet("/admin/course/list", transmit);
app.ajaxGet("/admin/courseware/list", transmit);
app.ajaxGet("/admin/video/list", transmit);
app.ajaxGet("/admin/question/list", transmit);

app.ajaxGet("/admin/course/count", transmit);
app.ajaxGet("/admin/courseware/count", transmit);
app.ajaxGet("/admin/video/count", transmit);
app.ajaxGet("/admin/question/count", transmit);

app.ajaxPost("/admin/course", transmit);
app.ajaxPost("/admin/courseware", transmit);
app.ajaxPost("/admin/video", transmit);
app.ajaxPost("/admin/question", transmit);

app.ajaxPut("/admin/course/:id", transmit);
app.ajaxPut("/admin/courseware/:id", transmit);
app.ajaxPut("/admin/video/:id", transmit);
app.ajaxPut("/admin/question/:id", transmit);

app.ajaxDelete("/admin/course/:id", transmit);
app.ajaxDelete("/admin/courseware/:id", transmit);
app.ajaxDelete("/admin/video/:id", transmit);
app.ajaxDelete("/admin/question/:id", transmit);

let v = new Date().getTime();
app.httpGet("/*", (req, res) => {
    res.render("admin.pug", {title: "攻防平台", v});
});
app.use(errorHandler);

// noinspection JSUnusedGlobalSymbols
export default () => {
    app.listen(PORT, (err: Error) => {
        console.log(err || `Start [Admin] Succ On ${PORT}`)
    })
}