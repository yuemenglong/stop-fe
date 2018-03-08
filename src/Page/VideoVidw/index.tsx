import * as React from "react";
import {RenderPairComponent} from "../../component/RenderPair/index";
import {ajaxPost, decodeObject} from "../../common/kit";
import {RouteComponentProps} from "react-router";
import {WebUploader} from "../../component/WebUploader/index";
import {Component} from "react";
import {Video} from "../../common/Video";

export class VideoView extends Component<RouteComponentProps<any>> {
    render() {
        let fileId = decodeObject(location.search.slice(1)).fileId;
        if (!fileId) {
            alert("文件标识不存在")
        }
        return <div>
            <h1>VideoView</h1>
            <Video src={`/video/${fileId}`}/>
        </div>
    }
}

