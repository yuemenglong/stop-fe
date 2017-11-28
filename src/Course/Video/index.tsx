import * as React from "react";
import {Table} from "../../common/Table";
import {ajax} from "../../common/kit";
import {Course, Courseware, Video} from "../../def/entity";
import {Modal} from "../../common/modal";
import {RenderPairComponent} from "../../component/RenderPair/index";
import {FileInfo, WebUploader} from "../../component/WebUploader/index";
import * as _ from "lodash";
import {RouteComponentProps} from "react-router";

class State {
    course: Course = new Course();
    video: Video = null;
}


export class VideoList extends RenderPairComponent<RouteComponentProps<any>, State> {
    getRenderRootMode(): { root: any; mode: string } {
        return {root: this.state, mode: "state"};
    }

    getCid() {
        return this.props.match.params.id;
    }

    constructor() {
        super();
        this.state = new State();
    }

    componentDidMount() {
        ajax({
            url: "/course/" + this.getCid(),
            type: "GET",
            success: (res) => {
                this.setState({course: res})
            }
        })
    }

    create() {
        this.setState({video: new Video()});
    }

    renderModal() {
        if (!this.state.video) {
            return;
        }
        let submit = () => {
            ajax({
                url: `/course/${this.getCid()}/video`,
                type: "POST",
                data: JSON.stringify(this.state.video),
                success: (res) => {
                    let course = _.cloneDeep(this.state.course);
                    course.videos.push(res);
                    course.videoCount = course.videos.length;
                    this.setState({course, video: null});
                }
            })
        };
        return <Modal>
            {this.renderPairInputText("video.name", "名字")}
            <WebUploader id="uploader" onChange={this.onUpload.bind(this)}/>
            <button onClick={submit}>确定</button>
        </Modal>
    }

    onUpload(file: FileInfo) {
        let video = _.clone(this.state.video);
        video.fileId = file.fileId;
        video.fileName = file.fileName;
        video.ext = file.ext;
        video.size = file.size;
        this.setState({video});
    }


    render() {
        let headerMap = {
            "name": "名称",
            "ext": "类型",
            "size": "大小",
        };
        let onDelete = (item: Video) => {
            ajax({
                url: `/course/${this.getCid()}/video/${item.id}`,
                type: "DELETE",
                success: () => {
                    // noinspection SillyAssignmentJS
                    location.href = location.href;
                }
            })
        };
        let extHeaders = [{
            name: "操作", render: (item: Video) => {
                return <div>
                    <a href={`/upload/${item.fileId}`}>下载</a>
                    <a href="javascript:void(0)" onClick={onDelete.bind(this, item)}>删除</a>
                </div>
            }
        }];
        return <div>
            <h1>视频</h1>
            <Table list={this.state.course.videos}
                   headerMap={headerMap}
                   extHeaders={extHeaders}
                   props={{className: "table"}}/>
            <button className="btn btn-primary" onClick={this.create.bind(this)}>新增</button>
            {this.renderModal()}
        </div>
    }
}

