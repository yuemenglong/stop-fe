import * as React from "react";
import {Component} from "react";
import {ListPageComponent, ListPageState} from "../../../common/list-page-component";
import {StudentStudyJob, StudentStudyJobItem, StudyJob} from "../../../def/entity";
import {ajaxGet} from "../../../common/kit";
import {RouteComponentProps} from "react-router";
import _ = require("lodash");
import {Table} from "../../../common/Table";
import {studyJobTypeMap} from "../../../def/data";

export class StudyJobStudentList extends Component<RouteComponentProps<any>, { job: StudyJob }> {
    constructor(props) {
        super(props);
        this.state = {job: new StudyJob()};
    }

    getId() {
        return this.props.match.params.id;
    }

    componentDidMount() {
        ajaxGet(`/study-job/${this.getId()}`, (res) => {
            this.setState({job: res})
        })
    }

    renderTable() {
        let headers = [
            {name: "姓名", render: "student.userName"},
            {
                name: "完成情况", render: (job: StudentStudyJob) => {
                return _(job.jobItems).groupBy(item => item.ty).toPairs().map((p) => {
                    let ty: string = p[0];
                    let items: Array<StudentStudyJobItem> = p[1];
                    let total = items.length;
                    let finished = items.filter(o => o.status == "succ").length;
                    let name = studyJobTypeMap[ty];
                    return `${name}:${finished}/${total}`;
                }).map((text, i) => <span key={i}>{text}</span>).value();
            }
            }
        ];
        return <Table className="table" list={this.state.job.jobs} headers={headers}/>
    }

    render() {
        return <div>
            <h1>Detail</h1>
            {this.renderTable()}
        </div>
    }

}
