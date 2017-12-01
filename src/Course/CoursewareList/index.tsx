import * as React from "react";
import {Table} from "../../common/Table";
import {ajax} from "../../common/kit";
import {Course, Courseware} from "../../def/entity";
import {Modal} from "../../common/modal";
import {RenderPairComponent} from "../../component/RenderPair/index";
import {FileInfo, WebUploader} from "../../component/WebUploader/index";
import * as _ from "lodash";
import {RouteComponentProps} from "react-router";

class State {
    course: Course = new Course();
    courseware: Courseware = null;
}


export class CoursewareList extends RenderPairComponent<RouteComponentProps<any>, State> {
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
        this.setState({courseware: new Courseware()});
    }

    renderModal() {
        if (!this.state.courseware) {
            return;
        }
        let submit = () => {
            ajax({
                url: `/course/${this.getCid()}/courseware`,
                type: "POST",
                data: JSON.stringify(this.state.courseware),
                success: (res) => {
                    let course = _.cloneDeep(this.state.course);
                    course.coursewares.push(res);
                    course.coursewareCount = course.coursewares.length;
                    this.setState({course, courseware: null});
                }
            })
        };
        return <Modal>
            {this.renderPairInputText("courseware.name", "名字")}
            <WebUploader id="uploader" onChange={this.onUpload.bind(this)}/>
            <button onClick={submit}>确定</button>
        </Modal>
    }

    onUpload(file: FileInfo) {
        let courseware = _.clone(this.state.courseware);
        courseware.fileId = file.fileId;
        courseware.fileName = file.fileName;
        courseware.ext = file.ext;
        courseware.size = file.size;
        this.setState({courseware});
    }


    render() {
        let onDelete = (item: Courseware) => {
            ajax({
                url: `/course/${this.getCid()}/courseware/${item.id}`,
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
            name: "操作", render: (item: Courseware) => <div>
                <a href={`/upload/${item.fileId}`} target="_blank">下载</a>
                <a href="javascript:void(0)" onClick={onDelete.bind(this, item)}>删除</a>
            </div>
        }];
        return <div>
            <h1>课件</h1>
            <Table list={this.state.course.coursewares}
                   headers={headers}
                   props={{className: "table"}}/>
            <button className="btn btn-primary" onClick={this.create.bind(this)}>新增</button>
            {this.renderModal()}
        </div>
    }
}

