import * as React from "react";
import {Table} from "../../../common/Table";
import {ajax} from "../../../common/kit";
import {Course, Courseware} from "../../../def/entity";
import {Modal} from "../../../common/modal";
import {RenderPairComponent} from "../../../component/RenderPair/index";
import {FileInfo, WebUploader} from "../../../component/WebUploader/index";
import * as _ from "lodash";

class State {
    course: Course = new Course();
    courseware: Courseware = null;
}

interface Props {
    cid: string
}

export class CoursewareList extends RenderPairComponent<Props, State> {
    getRenderRootMode(): { root: any; mode: string } {
        return {root: this.state, mode: "state"};
    }

    constructor() {
        super();
        this.state = new State();
    }

    componentDidMount() {
        ajax({
            url: "/course/" + this.props.cid,
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
                url: `/course/${this.props.cid}/courseware`,
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
        console.log(file);
        let courseware = _.clone(this.state.courseware);
        courseware.fileId = file.fileId;
        courseware.fileName = file.fileName;
        courseware.ext = file.ext;
        courseware.size = file.size;
        this.setState({courseware});

    }


    render() {
        let headerMap = {
            "name": "名称",
            "ext": "类型",
            "size": "大小",
        };
        let extHeaders = [{
            name: "操作", render: (item: Courseware) => {
                return <div>
                    <a href={`/upload/${item.fileId}`}>下载</a>
                    <a href={`/course/${this.props.cid}/courseware/${item.id}`}>删除</a>
                </div>
            }
        }];
        return <div>
            <h1>课件</h1>
            <Table list={this.state.course.coursewares}
                   headerMap={headerMap}
                   props={{className: "table"}}/>
            <button className="btn btn-primary" onClick={this.create.bind(this)}>新增</button>
            {this.renderModal()}
        </div>
    }
}

