import * as React from "react";
import {Component} from "react";
import {Route, RouteComponentProps} from "react-router";
import {Link} from "react-router-dom";
import {ListPageComponent, ListPageState} from "../../../common/list-page-component";
import {QuizJob, QuizJobItem} from "../../../def/entity";
import {JVOID0} from "../../../def/data";
import {RenderPairComponent} from "../../../component/RenderPair/index";
import {ajaxGet, ajaxPost, ajaxPut} from "../../../common/kit";
import {QuestionEdit} from "../../UserJobItem/index";
import {update} from "../../../common/updater";
import _ = require("lodash");

class State {
    job: QuizJob = new QuizJob;
}

export class QuizJobInfo extends RenderPairComponent<RouteComponentProps<any>, State> {
    getRenderRootMode(): { root: any; mode: string; onChange?: Function } {
        return {root: this.state, mode: "state"};
    }

    constructor(props) {
        super(props);
        this.state = new State();
    }

    getUid() {
        return this.props.match.params.uid;
    }

    getJid() {
        return this.props.match.params.jid;
    }

    componentDidMount() {
        ajaxGet(location.pathname, (res) => {
            this.setState({job: res})
        })
    }

    isSucc() {
        return this.state.job.status == "succ"
    }

    render() {
        let onChange = (item: QuizJobItem, answer) => {
            ajaxPut(`/user/${this.getUid()}/quiz-job/${item.jobId}/items/${item.id}`, {answer}, (res) => {
                let state = update(this.state, "job.items[id]{}", res, [item.id]);
                this.setState(state)
            });
        };
        let submit = () => {
            ajaxPut(`/user/${this.getUid()}/quiz-job/${this.getJid()}`, {status: "succ"}, (res) => {
                let job = _.merge({}, this.state.job, res);
                this.setState({job});
            })
        };
        return <div>
            {this.state.job.items.map(item => {
                let answer = null;
                if (this.isSucc() && item.correct == false) {
                    answer = <div>正确答案：{item.question.answer}</div>
                }
                return <div key={item.id}>
                    <QuestionEdit disabled={this.isSucc()}
                                  question={item.question}
                                  answer={item.answer}
                                  onChange={onChange.bind(null, item)}/>
                    {answer}
                </div>
            })}
            {(() => {
                if (!this.isSucc()) return <a href={JVOID0} onClick={submit}>交卷</a>
            })()}
            <Link to={`/user/${this.getUid()}/quiz-job`}>返回</Link>
        </div>
    }
}

