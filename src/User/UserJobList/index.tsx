import * as React from "react";
import {ListPageComponent, ListPageState} from "../../common/list-page-component";
import {StudentStudyJob, StudyJob} from "../../def/entity";
import {CurdComponent, CurdState} from "../../common/curd-component";
import {EH, TEH} from "../../common/render-component";
import _ = require("lodash");
import {Link} from "react-router-dom";

class UserStudyJobListInner extends CurdComponent<StudyJob> {

    constructor() {
        super();
        this.state = new CurdState<StudyJob>();
    }

    getUid() {
        return this.props.data.uid;
    }

    idField(): string {
        return "id";
    }

    urlSlice(): number {
        return 5;
    }

    getHeaderRender(onCreate: EH, onUpdate: TEH<StudyJob>, onDelete: TEH<StudyJob>): Array<{ name: string; render: any }> {
        return [
            {name: "名称", render: "job.name"},
            {name: "课程", render: "job.course.name"},
            {name: "截止时间", render: "job.limitDate"},
            {
                name: "状态", render: (job: StudentStudyJob) => {
                return {"succ": "已完成", "waiting": "未完成"}[job.status]
            }
            },
            {
                name: "操作", render: (job: StudentStudyJob) => {
                return <div>
                    <Link to={`/user/${this.getUid()}/study-job/${job.id}`}>继续学习</Link>
                </div>
            }
            }
        ]
    }

    renderContent(renderTable: () => any, renderModal: () => any, onCreate: EH, onUpdate: TEH<StudyJob>, onDelete: TEH<StudyJob>): any {
        return <div>
            {renderTable()}
        </div>
    }

    itemConstructor(): StudyJob {
        return new StudyJob();
    }

    renderModalContent(onChange: TEH<StudyJob>, onSubmit: EH, onCancel: EH): any {
        return;
    }

    getRenderRootMode(): { root: any; mode: string; onChange?: Function } {
        return {root: this.state, mode: "state"};
    }
}

export class UserStudyJobList extends ListPageComponent<StudyJob> {
    constructor() {
        super();
        this.state = new ListPageState<StudyJob>();
    }

    getDataUrl(): string {
        return `/user/${this.getUid()}/study-job/list`;
    }

    getCountUrl(): string {
        return `/user/${this.getUid()}/study-job/count`;
    }

    initFilter(): Object {
        return {};
    }

    getPageRange(): number {
        return 4;
    }

    renderPage(renderPagination: () => any, refresh: (e?: any) => void, swtch: (page: number) => void): any {
        return <div>
            <UserStudyJobListInner
                list={this.state.list}
                history={this.props.history} onChange={_.noop}
                data={{uid: this.getUid()}}/>
        </div>;
    }

    getUid() {
        return this.props.match.params.uid;
    }
}

