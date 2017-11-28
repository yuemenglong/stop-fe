import * as React from "react"
import {Component} from "react";
import {hideLoading, showLoading} from "../../common/loading";

interface Props {
    id: string,
    className?: string,
    onChange: (file: FileInfo) => void,
    onError?: (err: any) => void,
}

export interface FileInfo {
    fileId: string,
    fileName: string,
    size: number,
    ext: string,
}

class State {
    uploader: any = {};
}

export class WebUploader extends Component<Props, State> {
    constructor() {
        super();
        this.state = new State();
    }

    componentDidMount() {
        let uploader = (window as any).WebUploader.create({
            // swf文件路径
            swf: '/bundle/webuploader/Uploader.swf',
            server: '/upload',
            pick: `#${this.props.id}-picker`,
            resize: false
        });
        this.setState({uploader: uploader});
        uploader.on('fileQueued', function (file) {
            // console.log("fileQueued", file)
            uploader.upload();
        });
        uploader.on('startUpload', () => {
            showLoading()
        });
        uploader.on('uploadSuccess', (file, res) => {
            let info = {fileId: res._raw, fileName: file.name, size: file.size, ext: file.ext}
            this.props.onChange(info)
        });

        uploader.on('uploadError', function (file, err) {
            if (this.props.onError) {
                this.props.onError(err)
            } else {
                alert(err)
            }
        });

        uploader.on('uploadComplete', function () {
            hideLoading()
        });
    }

    upload() {
        this.state.uploader.upload();
    }

    render() {
        return <div id={this.props.id} className={this.props.className}>
            <div id="thelist" className="uploader-list"/>
            <div className="btns">
                <div id={`${this.props.id}-picker`}>选择文件</div>
                {/*<button className="btn btn-default" onClick={this.upload.bind(this)}>开始上传</button>*/}
            </div>
        </div>
    }
}