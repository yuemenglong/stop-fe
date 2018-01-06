import * as React from "react";
import {Component} from "react";
import {ListPageComponent, ListPageState} from "../../../common/list-page-component";
import {StudentStudyJob, StudentStudyJobItem, StudyJob} from "../../../def/entity";
import {ajaxGet} from "../../../common/kit";
import {RouteComponentProps} from "react-router";
import _ = require("lodash");
import {Table} from "../../../common/Table";
import {Def} from "../../../def/data";

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
            {name: "状态", render: (item) => Def.statusMap[item.status]},
            {
                name: "详细情况", render: (job: StudentStudyJob) => {
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
        return <Table className="table" list={this.state.job.jobs} headers={headers}/>
    }

    render() {
        return <div>
            <h1>任务完成情况</h1>
            {this.renderTable()}
        </div>
    }

}

