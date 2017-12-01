import * as React from "react";
import {Table} from "../../common/Table";
import {ajax} from "../../common/kit";
import {Course, Courseware, Video} from "../../def/entity";
import {Modal} from "../../common/modal";
import {RenderPairComponent} from "../../component/RenderPair/index";
import {FileInfo, WebUploader} from "../../component/WebUploader/index";
import * as _ from "lodash";
import {RouteComponentProps} from "react-router";
import {Link} from "react-router-dom";

class State {
    video: Video = null;
}

interface Props {
    video: Video;
    cid: string;
    onChange: Function;
}


export class VideoInfo extends RenderPairComponent<Props, State> {
    getRenderRootMode(): { root: any; mode: string } {
        return {root: this.state, mode: "state"};
    }

    getCid() {
        return this.props.cid;
    }

    constructor(props) {
        super(props);
        this.state = {video: props.video}
    }

    // componentWillMount() {
    //     if (!this.state.video) {
    //         location.href = `/`;
    //     }
    // }

    render() {
        let onChange = (file) => {
            let video = _.clone(this.state.video);
            video.fileId = file.fileId;
            video.fileName = file.fileName;
            video.ext = file.ext;
            video.size = file.size;
            this.setState({video});
        };
        let submit = () => {
            if (!this.state.video.id) {
                ajax({
                    url: `/course/${this.getCid()}/video`,
                    type: "POST",
                    data: JSON.stringify(this.state.video),
                    success: (res) => {
                        this.props.onChange(res)
                    }
                })
            } else {
                ajax({
                    url: `/course/${this.getCid()}/video/${this.state.video.id}`,
                    type: "PUT",
                    data: JSON.stringify(this.state.video),
                    success: (res) => {
                        this.props.onChange(res)
                    }
                })
            }
        };
        return <Modal>
            {this.renderPairInputText("video.name", "名字")}
            <WebUploader key={this.state.video.fileId || ""} id="uploader" onChange={onChange}/>
            <button onClick={submit}>确定</button>
            <Link to={`/course/${this.getCid()}/video`}>取消</Link>
        </Modal>
    }


}

