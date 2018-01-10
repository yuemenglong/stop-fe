class Conf {
    port: number;
    transmitHost: string;
    transmitPort: number;
    uploadPath: string;
    pptPath: string;
    videoPath: string;
    targetPath: string;

    constructor(port: number,
                tsHost: string,
                tsPort: number,
                uploadPath: string = null,
                pptPath: string = null,
                videoPath: string = null,
                targetPath: string = null) {
        this.port = port;
        this.transmitHost = tsHost;
        this.transmitPort = tsPort;
        this.pptPath = pptPath;
        this.videoPath = videoPath;
        this.uploadPath = uploadPath;
        this.targetPath = targetPath;
    }
}

const adminConf = new Conf(82, "localhost", 8080,
    "D:/upload",
    "D:/upload/ppt",
    "D:/upload/video",
    "D:/target");
const teacherConf = new Conf(81, "localhost", 8080,
    "D:/upload",
    "D:/upload/ppt",
    "D:/upload/video",
    "D:/target");
const userConf = new Conf(80, "localhost", 8080,
    "D:/upload",
    "D:/upload/ppt",
    "D:/upload/video",
    "D:/target");
// const userConf = new Conf(80, "localhost", 8080, "D:\\upload");

export {userConf, teacherConf, adminConf}
