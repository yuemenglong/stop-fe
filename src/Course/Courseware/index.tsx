import * as React from "react";
import {Table} from "../../common/Table";
import {ajax} from "../../common/kit";
import {PropsEx} from "../../common/common-type";
import {Course, Courseware} from "../../def/entity";
import {Modal} from "../../common/modal";
import {RenderPairComponent} from "../../component/RenderPair/index";
import {FileInfo, WebUploader} from "../../component/WebUploader/index";

class State {
    course: Course = new Course();
    courseware: Courseware = null;
}

export class CoursewareList extends RenderPairComponent<PropsEx, State> {
    getRenderRootMode(): { root: any; mode: string } {
        return {root: this.state, mode: "state"};
    }

    constructor() {
        super();
        this.state = new State();
    }

    componentDidMount() {
        ajax({
            url: "/course/" + this.props.match.params.id,
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

        };
        return <Modal>
            {this.renderPairInputText("courseware.name", "名字")}
            <WebUploader id="uploader" onChange={this.onUpload.bind(this)}/>
            <button onClick={submit}>确定</button>
        </Modal>
    }

    onUpload(file: FileInfo) {
        console.log(file)
        let courseware = _.clone(this.state.courseware)
    }

    render() {
        let headerMap = {
            "name": "名称",
            "ext": "类型",
            "size": "大小",
        };
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

