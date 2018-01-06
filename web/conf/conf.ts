class Conf {
    port: number;
    transmitHost: string;
    transmitPort: number;
    uploadPath: string;
    targetPath: string;

    constructor(port: number,
                tsHost: string,
                tsPort: number,
                uploadPath: string = null,
                targetPath: string = null) {
        this.port = port;
        this.transmitHost = tsHost;
        this.transmitPort = tsPort;
        this.uploadPath = uploadPath;
        this.targetPath = targetPath;
    }
}

const adminConf = new Conf(82, "localhost", 8080, "D:\\upload", "D:/target");
const teacherConf = new Conf(81, "localhost", 8080, "D:\\upload", "D:/target");
const userConf = new Conf(80, "localhost", 8080, "D:\\upload", "D:/target");
// const userConf = new Conf(80, "localhost", 8080, "D:\\upload");

export {userConf, teacherConf, adminConf}
