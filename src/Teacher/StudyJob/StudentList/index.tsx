import * as React from "react";
import {Component} from "react";
import {ListPageComponent, ListPageState} from "../../../common/list-page-component";
import {StudentStudyJob, StudentStudyJobItem, StudyJob} from "../../../def/entity";
import {ajaxGet} from "../../../common/kit";
import {RouteComponentProps} from "react-router";
import _ = require("lodash");
import {Table} from "../../../common/Table";
import {Def} from "../../../def/data";
import "./style.less";

export class StudyJobStudentList extends Component<RouteComponentProps<any>, { job: StudyJob }> {
    constructor(props) {
        super(props);
        this.state = {job: new StudyJob()};
    }

    getId() {
        return this.props.match.params.id;
    }

    componentDidMount() {
        ajaxGet(`/teacher/study-job/${this.getId()}`, (res) => {
            this.setState({job: res})
        })
    }

    renderTable() {
        let headers = [
            {name: "姓名", render: "student.name"},
            {
                name: "完成情况", render: (job: StudentStudyJob) => {
                return _(job.items).groupBy(item => item.ty).toPairs().map((p) => {
                    let ty: string = p[0];
                    let items: Array<StudentStudyJobItem> = p[1];
                    let total = items.length;
                    let finished = items.filter(o => o.status == "succ").length;
                    let name = Def.studyJobTypeMap[ty];
                    return `${name}:${finished}/${total}`;
                }).map((text, i) => <span key={i}>{text}</span>).value();
            }
            }
        ];
        return <Table className="table table-bordered table-striped dataTable" list={this.state.job.jobs}
                      headers={headers}/>
    }

    render() {
        return <div className={'teacher-study-job-student-list'}>
            <div>当前位置：学习任务 > 完成情况</div>
            <div className={'box'}>{this.renderTable()}</div>
        </div>
    }

}

