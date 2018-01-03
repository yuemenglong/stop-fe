import * as React from "react"
import {Component} from "react";
import {hideLoading, showLoading} from "../../common/loading";
import {Kit} from "../../common/kit";
import {FileInfo} from "../../def/entity";

interface Props {
    className?: string,
    onChange: (file: FileInfo) => void,
    onError?: (err: any) => void,
    text?: string,
    accept?: { title?: string, extensions?: string, mimeTypes?: string }
}

class State {
    uploader: any = {};
    id: string = Kit.randomId();
}

export class WebUploader extends Component<Props, State> {
    constructor() {
        super();
        this.state = new State();
    }

    // noinspection JSUnusedGlobalSymbols
    static defaultProps = {
        className: "",
        onError: (err) => alert(err),
        text: "选择文件",
    };


    componentDidMount() {
        let uploader = (window as any).WebUploader.create({
            // swf文件路径
            swf: '/deploy/webuploader/Uploader.swf',
            server: '/upload',
            pick: {id: `#${this.state.id}`, multiple: false},
            accept: this.props.accept,
            resize: false
        });
        this.setState({uploader: uploader});
        uploader.on('fileQueued', function (file) {
            // console.log("fileQueued", file)
            uploader.upload();
        });
        uploader.on('startUpload', () => {
            showLoading();
        });
        uploader.on('uploadSuccess', (file, res) => {
            hideLoading();
            let info = {fileId: res._raw, fileName: file.name, size: file.size, ext: file.ext} as FileInfo;
            this.props.onChange(info)
        });

        uploader.on('uploadError', function (file, err) {
            hideLoading();
            this.props.onError(err)
        });
    }

    componentWillUnmount() {
        // this.state.uploader.destroy();
    }

    upload() {
        this.state.uploader.upload();
    }

    render() {
        return <div className={this.props.className}>
            <div id={this.state.id}>{this.props.text}</div>
        </div>
    }
}
