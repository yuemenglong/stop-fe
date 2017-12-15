import * as React from "react";
import {Component} from "react";
import {Route} from "react-router";
import {CurdComponent, CurdState} from "../../../common/curd-component";
import {StudyJob} from "../../../def/entity";
import {EH, TEH} from "../../../common/render-component";
import {ListPageComponent, ListPageState} from "../../../common/list-page-component";
import {JVOID0} from "../../../def/data";
import {ajaxGet, Kit} from "../../../common/kit";
import {update} from "../../../common/updater";
import {DatePicker} from "../../../component/DatePicker/index";
import {Link} from "react-router-dom";

class StudyJobListInner extends CurdComponent<StudyJob> {

    constructor(props) {
        super(props);
        this.state = new CurdState<StudyJob>();
    }

    componentDidMount() {
        ajaxGet(`/teacher/course/list?limit=10000`, (res) => {
            let state = update(this.state, "data.courses", res);
            this.setState(state)
        });
        ajaxGet(`/teacher/clazz/list?limit=10000`, (res) => {
            let state = update(this.state, "data.clazzs", res);
            this.setState(state)
        });
        ($("#datepicker") as any).datepicker();
    }

    idField(): string {
        return "id";
    }

    urlSlice(): number {
        return 3;
    }

    getHeaderRender(onCreate: EH, onUpdate: TEH<StudyJob>, onDelete: TEH<StudyJob>): Array<{ name: string; render: any }> {
        return [
            {name: "名称", render: "name"},
            {name: "课程", render: "course.name"},
            {
                name: "操作", render: (job: StudyJob) => {
                return <div>
                    <a href={JVOID0} onClick={onUpdate.bind(null, job)}>编辑</a>
                    <a href={JVOID0} onClick={onDelete.bind(null, job)}>删除</a>
                    <Link to={`/teacher/study-job/${job.id}/student`}>完成情况</Link>
                </div>
            }
            }
        ]
    }

    renderContent(renderTable: () => any, renderRoute: () => any, onCreate: EH, onUpdate: TEH<StudyJob>, onDelete: TEH<StudyJob>): any {
        return <div>
            {renderTable()}
            {renderRoute()}
            <button onClick={onCreate}>新增</button>
        </div>
    }

    itemConstructor(): StudyJob {
        return new StudyJob();
    }

    renderModalContent(onChange: TEH<StudyJob>, onSubmit: EH, onCancel: EH): any {
        let courseList = Kit.optionValueList(this.state.data.courses, "name");
        let clazzList = Kit.optionValueList(this.state.data.clazzs, "name");
        return <div>
            {this.renderPairInputText("item.name", "名称")}
            {this.renderPairSelect("item.courseId", "课程", courseList)}
            {this.renderPairSelect("item.clazzId", "班级", clazzList)}
            {this.renderPairDatePicker("item.limitDate", "截止日期")}
            <button onClick={onSubmit}>确定</button>
            <button onClick={onCancel}>取消</button>
        </div>;
    }

    getRenderRootMode(): { root: any; mode: string; onChange?: Function } {
        return {root: this.state, mode: "state"};
    }
}

export class StudyJobList extends ListPageComponent<StudyJob> {

    constructor(props) {
        super(props);
        this.state = new ListPageState<StudyJob>();
    }

    getDataUrl(): string {
        return "/teacher/study-job/list";
    }

    getCountUrl(): string {
        return "/teacher/study-job/count";
    }

    initFilter(): Object {
        return {};
    }

    getPageRange(): number {
        return 4;
    }

    renderPage(renderPagination: () => any, refresh: (e?: any) => void, swtch: (page: number) => void): any {
        let onChange = (list) => {
            this.setState({list})
        };
        return <div>
            <StudyJobListInner history={this.props.history}
                               list={this.state.list} onChange={onChange}/>
        </div>
    }
}

