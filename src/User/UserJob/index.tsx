import * as React from "react";
import {StudentStudyJob, StudentStudyJobItem, StudyJob} from "../../def/entity";
import {Component} from "react";
import {RouteComponentProps} from "react-router";
import {ajaxGet} from "../../common/kit";
import {Def} from "../../def/data";
import {Table} from "../../common/Table";
import {Link} from "react-router-dom";

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
                return Def.studyJobTypeMap[item.ty]
            }
            },
            {
                name: "状态", render: (item: StudentStudyJobItem) => {
                return Def.statusMap[item.status];
            }
            },
            {
                name: "操作", render: (item: StudentStudyJobItem) => {
                return <div>
                    <Link to={`/user/${this.getUid()}/study-job/${item.studentStudyJobId}/item/${item.id}`}>去完成</Link>
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

