class Conf {
    port: number;
    transmitHost: string;
    transmitPort: number;
    uploadPath: string;

    constructor(port: number, tsHost: string, tsPort: number, uploadPath: string = null) {
        this.port = port;
        this.transmitHost = tsHost;
        this.transmitPort = tsPort;
        this.uploadPath = uploadPath;
    }
}

const conf = new Conf(80, "localhost", 8080, "D:\\upload");

export {conf}
