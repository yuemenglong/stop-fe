import * as React from "react";
import {ajax} from "../../common/kit";
import {Course, Courseware} from "../../def/entity";
import {RenderPairComponent} from "../../component/RenderPair/index";
import {RouteComponentProps} from "react-router";
import {CurdComponent, CurdState} from "../../common/curd-component";
import {EH, TEH} from "../../common/render-component";
import {update} from "../../common/updater";
import {JVOID0} from "../../def/data";
import {FileInfo, WebUploader} from "../../component/WebUploader/index";
import _ = require("lodash");

class State {
    course: Course = new Course();
    courseware: Courseware = null;
}

class CoursewareListInner extends CurdComponent<Courseware> {
    constructor(props) {
        super(props);
        this.state = new CurdState<Courseware>();
    }

    itemConstructor(): Courseware {
        return new Courseware();
    }

    renderModalContent(onChange: TEH<Courseware>,
                       onSubmit: EH,
                       onCancel: EH): any {
        let onUpload = (file: FileInfo) => {
            let courseware = _.clone(this.state.item);
            courseware.fileId = file.fileId;
            courseware.fileName = file.fileName;
            courseware.ext = file.ext;
            courseware.size = file.size;
            onChange(courseware);
        };
        return <div>
            {this.renderPairInputText("item.name", "名字")}
            <WebUploader id="uploader" onChange={onUpload}/>
            <button onClick={onSubmit}>确定</button>
            <button onClick={onCancel}>取消</button>
        </div>
    }

    urlSlice(): number {
        return 4;
    }

    idField(): string {
        return "id";
    }

    getHeaderRender(onCreate: EH, onUpdate: TEH<Courseware>, onDelete: TEH<Courseware>): Array<{ name: string; render: any }> {
        return [{
            name: "名称", render: "name",
        }, {
            name: "类型", render: "ext",
        }, {
            name: "大小", render: "size",
        }, {
            name: "操作", render: (item: Courseware) => <div>
                <a href={`/upload/${item.fileId}`} target="_blank">下载</a>
                <a href={JVOID0} onClick={onUpdate.bind(null, item)}>修改</a>
                <a href={JVOID0} onClick={onDelete.bind(null, item)}>删除</a>
            </div>
        }];
    }

    renderContent(renderTable: () => any,
                  renderRoute: () => any,
                  onCreate: EH,
                  onUpdate: TEH<Courseware>,
                  onDelete: TEH<Courseware>): any {
        return <div>
            <h1>课件</h1>
            {renderTable()}
            <button onClick={onCreate}>添加</button>
            {renderRoute()}
        </div>
    }

    getRenderRootMode(): { root: any; mode: string } {
        return {root: this.state, mode: "state"};
    }
}

export class CoursewareList extends RenderPairComponent<RouteComponentProps<any>, State> {
    getRenderRootMode(): { root: any; mode: string } {
        return {root: this.state, mode: "state"};
    }

    getCid() {
        return location.pathname.split("/")[2];
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
        let onChange = (list) => {
            let state = update(this.state, "course.coursewares", list)
            this.setState(state);
            console.log(state);
        };
        return <CoursewareListInner
            list={this.state.course.coursewares}
            onChange={onChange}
            history={this.props.history}/>
    }
}

