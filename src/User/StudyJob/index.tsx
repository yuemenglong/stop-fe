import * as React from "react";
import {StudentStudyJob, StudentStudyJobItem, StudyJob} from "../../def/entity";
import {Component} from "react";
import {RouteComponentProps} from "react-router";
import {ajaxGet} from "../../common/kit";
import {studyJobTypeMap, studyStatusMap} from "../../def/data";
import {Table} from "../../common/Table";

class State {
    job: StudentStudyJob = new StudentStudyJob();
}

export class UserStudyJob extends Component<RouteComponentProps<any>, State> {
    constructor() {
        super();
        this.state = new State();
    }

    getUid() {
        return this.props.match.params.uid;
    }

    getJid() {
        return this.props.match.params.jid;
    }

    componentDidMount() {
        ajaxGet(`/user/${this.getUid()}/study-job/${this.getJid()}`, (res) => {
            this.setState({job: res})
        })
    }

    render() {
        let headers = [
            {
                name: "类型", render: (item: StudentStudyJobItem) => {
                return studyJobTypeMap[item.ty]
            }
            },
            {
                name: "状态", render: (item: StudentStudyJobItem) => {
                return studyStatusMap[item.status];
            }
            },
            {
                name: "操作", render: (item: StudentStudyJobItem) => {
                return <div>
                    <a target="_blank"
                       href={`/user/${this.getUid()}/study-job/${item.studentStudyJobId}/item/${item.id}`}>去完成</a>
                </div>
            }
            },
        ];
        return <div>
            <Table className="table"
                   list={this.state.job.items} headers={headers}/>
        </div>
    }
}

