import * as React from "react"
import {Component} from "react";
import {hideLoading, showLoading} from "../../common/loading";
import {Kit} from "../../common/kit";
import {FileInfo} from "../../def/entity";
import _ = require("lodash");

interface Props {
    className?: string,
    onChange: (file: any) => void,
    onError?: (err: any) => void,
    text?: string,
    accept?: { title?: string, extensions?: string, mimeTypes?: string },
    server?: string,
    multiple?: boolean,
}

class State {
    uploader: any = {};
    id: string = Kit.randomId();
    counter: number = 0;
    list: Array<FileInfo> = [];
}

export class WebUploader extends Component<Props, { key: string }> {
    constructor(props) {
        super(props);
        this.state = {key: Kit.randomId()}
    }

    render() {
        let onChange = (file) => {
            this.setState({key: Kit.randomId()});
            this.props.onChange(file);
        };
        let props = _.defaults({onChange}, this.props);
        return <WebUploaderInner key={this.state.key} {...props}/>
    }
}

class WebUploaderInner extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = new State();
    }

    // noinspection JSUnusedGlobalSymbols
    static defaultProps = {
        className: "",
        onError: (err) => alert(err),
        text: "选择文件",
        server: "/upload",
        multiple: false,
    };


    componentDidMount() {
        let uploader = (window as any).WebUploader.create({
            // swf文件路径
            swf: '/deploy/webuploader/Uploader.swf',
            server: this.props.server,
            pick: {id: `#${this.state.id}`, multiple: this.props.multiple},
            accept: this.props.accept,
            resize: false
        });
        this.setState({uploader: uploader});
        if (!this.props.multiple) {
            uploader.on('fileQueued', (file) => {
                uploader.upload();
            });
        } else {
            uploader.on("filesQueued", files => {
                this.setState({counter: files.length});
                uploader.upload();
            });
        }
        uploader.on('startUpload', () => {
            showLoading();
        });
        uploader.on('uploadSuccess', (file, res) => {
            let info = {fileId: res._raw, fileName: file.name, size: file.size, ext: file.ext} as FileInfo;
            if (!this.props.multiple) {
                hideLoading();
                this.setState({list: [], counter: 0});
                this.props.onChange(info);
                return;
            }
            let list = this.state.list.concat([info]);
            if (list.length == this.state.counter) {
                hideLoading();
                this.setState({list: [], counter: 0});
                this.props.onChange(list)
            } else {
                this.setState({list: list})
            }
        });

        uploader.on('uploadError', (file, err) => {
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
        return <div className={this.props.className} id={this.state.id}>{this.props.text}</div>
    }
}
