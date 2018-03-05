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
import {_teacherLeftLocation} from "../../../common/common-method";
import './style.less';

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
                return <div className={'study-job-table-btns'}>
                    <a href={JVOID0} onClick={onUpdate.bind(null, job)}>编辑</a>
                    <a href={JVOID0} onClick={onDelete.bind(null, job)}>删除</a>
                    <Link to={`/teacher/study-job/${job.id}/student`}>完成情况</Link>
                </div>
            }
            }
        ]
    }

    renderContent(renderTable: () => any, renderRoute: () => any, onCreate: EH, onUpdate: TEH<StudyJob>, onDelete: TEH<StudyJob>): any {
        return <div className={'teacher-study-job-list'}>
            <div>{"当前位置：" + _teacherLeftLocation}</div>
            <div className={'box'}>
                <button onClick={onCreate} className={'btn bg-orange btn-add'}>新增</button>
                {renderTable()}
                {renderRoute()}
            </div>
        </div>
    }

    itemConstructor(): StudyJob {
        return new StudyJob();
    }

    renderModalContent(onChange: TEH<StudyJob>, onSubmit: EH, onCancel: EH, modalHeader: (item: string) => void): any {
        let courseList = Kit.optionValueList(this.state.data.courses, "name");
        let clazzList = Kit.optionValueList(this.state.data.clazzs, "name");
        return <div className={'modal-content'}>
            {modalHeader('新增学习任务')}
            <div className={'modal-body'}>
                {this.renderPairInputText("item.name", "名称")}
                {this.renderPairSelect("item.courseId", "课程", courseList)}
                {this.renderPairSelect("item.clazzId", "班级", clazzList)}
                {this.renderPairDatePicker("item.limitDate", "截止日期")}
            </div>
            <div className={'modal-footer'}>
                <button onClick={onCancel} className='btn btn-default'>取消</button>
                <button onClick={onSubmit} className='btn btn-primary'>确定</button>
            </div>
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

