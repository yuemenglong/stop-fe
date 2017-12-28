import * as React from "react";
import {Component} from "react";
import {RouteComponentProps} from "react-router";
import {Link} from "react-router-dom";
import {ListPageComponent, ListPageProps, ListPageState} from "../../../common/list-page-component";
import {Quiz, QuizJob} from "../../../def/entity";
import {JVOID0} from "../../../def/data";
import {CurdComponent, CurdState} from "../../../common/curd-component";
import {EH, TEH} from "../../../common/render-component";
import {ajaxGet} from "../../../common/kit";
import {Table} from "../../../common/Table";

class State {
    jobs: Array<QuizJob> = [];
}

export class QuizJobList extends Component<RouteComponentProps<any>, State> {
    constructor(props) {
        super(props);
        this.state = new State();
    }

    getQid() {
        return this.props.match.params.qid;
    }

    componentDidMount() {
        ajaxGet(`/teacher/quiz/${this.getQid()}/jobs`, (res) => {
            console.log(res);
            this.setState({jobs: res})
        })
    }

    render() {
        let headers = [{
            name: "姓名", render: "student.name",
        }, {
            name: "完成情况", render: (item: QuizJob) => {
                return {succ: "已完成", waiting: "未完成"}[item.status]
            },
        }, {
            name: "分数", render: "score",
        }];
        return <div>
            <Table className="table" list={this.state.jobs} headers={headers}/>
        </div>
    }
}
