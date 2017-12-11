import * as React from "react";
import {ajax} from "../../../common/kit";
import {Course, Video} from "../../../def/entity";
import {FileInfo, WebUploader} from "../../../component/WebUploader/index";
import {RouteComponentProps} from "react-router";
import {CurdComponent, CurdState} from "../../../common/curd-component";
import {EH, TEH} from "../../../common/render-component";
import {JVOID0} from "../../../def/data";
import {Component} from "react";
import {update} from "../../../common/updater";

class State {
    course: Course = new Course();
    video: Video = null;
}

class VideoListInner extends CurdComponent<Video> {
    constructor() {
        super();
        this.state = new CurdState<Video>();
    }

    idField(): string {
        return "id";
    }

    urlSlice(): number {
        return 4;
    }

    getHeaderRender(onCreate: EH, onUpdate: TEH<Video>, onDelete: TEH<Video>): Array<{ name: string; render: any }> {
        return [{
            name: "名称", render: "name",
        }, {
            name: "类型", render: "ext",
        }, {
            name: "大小", render: "size",
        }, {
            name: "操作", render: (item: Video) => <div>
                <a href={JVOID0} onClick={onUpdate.bind(null, item)}>修改</a>
                <a href={`/upload/${item.fileId}`} target="_blank">下载</a>
                <a href={JVOID0} onClick={onDelete.bind(this, item)}>删除</a>
            </div>
        }];
    }

    renderContent(renderTable: () => any, renderModal: () => any, onCreate: EH, onUpdate: TEH<Video>, onDelete: TEH<Video>): any {
        return <div>
            {renderTable()}
            {renderModal()}
            <button onClick={onCreate}>新增</button>
        </div>;
    }

    itemConstructor(): Video {
        return new Video();
    }

    renderModalContent(onChange: TEH<Video>, onSubmit: EH, onCancel: EH): any {
        let onUpload = (f: FileInfo) => {
            let state = update(this.state, "item{}", f);
            this.setState(state)
        };
        let file = <WebUploader onChange={onUpload}/>;
        if (this.state.item.fileName) {
            file = <div>{this.state.item.fileName}</div>
        }
        console.log(this.state.item);
        return <div>
            {this.renderPairInputText("item.name", "名字")}
            {file}
            {/*<WebUploader onChange={onChange}/>*/}
            <a href={JVOID0} onClick={onSubmit}>确定</a>
            <a href={JVOID0} onClick={onCancel}>取消</a>
        </div>
    }

    getRenderRootMode(): { root: any; mode: string; onChange?: Function } {
        return {root: this.state, mode: "state"};
    }

}

export class VideoList extends Component<RouteComponentProps<any>, State> {
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
        let onChange = (videos) => {
            let state = update(this.state, "course.videos", videos);
            this.setState(state)
        };
        return <VideoListInner history={this.props.history} list={this.state.course.videos} onChange={onChange}/>
        // let onDelete = (item: Video) => {
        //     ajax({
        //         url: `/course/${this.getCid()}/video/${item.id}`,
        //         type: "DELETE",
        //         success: () => {
        //             // noinspection SillyAssignmentJS
        //             location.href = location.href;
        //         }
        //     })
        // };
        // let headers = [{
        //     name: "名称", render: "name",
        // }, {
        //     name: "类型", render: "ext",
        // }, {
        //     name: "大小", render: "size",
        // }, {
        //     name: "操作", render: (item: Video) => <div>
        //         <Link to={`/course/${this.getCid()}/video/${item.id}`}>修改</Link>
        //         <a href={`/upload/${item.fileId}`} target="_blank">下载</a>
        //         <a href="javascript:void(0)" onClick={onDelete.bind(this, item)}>删除</a>
        //     </div>
        // }];
        // let create = (video) => {
        //     let course = _.cloneDeep(this.state.course);
        //     course.videos.push(video);
        //     this.setState({course});
        // };
        // let update = (video) => {
        //     let course = _.cloneDeep(this.state.course);
        //     course.videos.map(v => v.id == video.id ? video : v);
        //     this.setState({course});
        // };
        // let render = (props) => {
        //     let vid = props.match.params.vid;
        //     if (vid == "init") {
        //         return <VideoInfo video={new Video()} cid={this.getCid()} onChange={create}/>
        //     } else {
        //         let video = this.state.course.videos.filter(v => v.id == vid)[0];
        //         if (video) {
        //             return <VideoInfo video={video} cid={this.getCid()} onChange={update}/>
        //         } else {
        //             return <div/>;
        //         }
        //     }
        // };
        // return <div>
        //     <h1>视频</h1>
        //     <Table list={this.state.course.videos}
        //            headers={headers}
        //            props={{className: "table"}}/>
        //     <Link to={`/course/${this.getCid()}/video/init`}>新增</Link>
        //     {/*<button className="btn btn-primary" onClick={this.create.bind(this)}>新增</button>*/}
        //     <Route path="/course/:cid/video/:vid" render={render}/>
        // </div>
    }
}

