import * as React from "react";
import {Table} from "../../../common/Table";
import {ajax} from "../../../common/kit";
import {Course, Courseware, Video} from "../../../def/entity";
import {Modal} from "../../../common/modal";
import {RenderPairComponent} from "../../../component/RenderPair/index";
import {FileInfo, WebUploader} from "../../../component/WebUploader/index";
import * as _ from "lodash";
import {Route, RouteComponentProps} from "react-router";
import {Link} from "react-router-dom";
import {VideoInfo} from "../VideoInfo/index";

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

    render() {
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
        let headers = [{
            name: "名称", render: "name",
        }, {
            name: "类型", render: "ext",
        }, {
            name: "大小", render: "size",
        }, {
            name: "操作", render: (item: Video) => <div>
                <Link to={`/course/${this.getCid()}/video/${item.id}`}>修改</Link>
                <a href={`/upload/${item.fileId}`} target="_blank">下载</a>
                <a href="javascript:void(0)" onClick={onDelete.bind(this, item)}>删除</a>
            </div>
        }];
        let create = (video) => {
            let course = _.cloneDeep(this.state.course);
            course.videos.push(video);
            this.setState({course});
        };
        let update = (video) => {
            let course = _.cloneDeep(this.state.course);
            course.videos.map(v => v.id == video.id ? video : v);
            this.setState({course});
        };
        let render = (props) => {
            let vid = props.match.params.vid;
            if (vid == "init") {
                return <VideoInfo video={new Video()} cid={this.getCid()} onChange={create}/>
            } else {
                let video = this.state.course.videos.filter(v => v.id == vid)[0];
                if (video) {
                    return <VideoInfo video={video} cid={this.getCid()} onChange={update}/>
                } else {
                    return <div/>;
                }
            }
        };
        return <div>
            <h1>视频</h1>
            <Table list={this.state.course.videos}
                   headers={headers}
                   props={{className: "table"}}/>
            <Link to={`/course/${this.getCid()}/video/init`}>新增</Link>
            {/*<button className="btn btn-primary" onClick={this.create.bind(this)}>新增</button>*/}
            <Route path="/course/:cid/video/:vid" render={render}/>
        </div>
    }
}

