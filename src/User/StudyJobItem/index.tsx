///<reference path="../../../node_modules/@types/lodash/index.d.ts"/>
import * as React from "react";
import {RouteComponentProps} from "react-router";
import {Component} from "react";
import {ajaxGet, ajaxPost} from "../../common/kit";
import {Courseware, Question, StudentStudyJobItem, Video} from "../../def/entity";
import {CheckGroup} from "../../component/CheckGroup/index";
import _ = require("lodash");

interface Props {
    userId: string,
    jobId: string,
    jobItemId: string,
    question: Question,
    history: any,
}

class QuestionJob extends Component<Props, { answer: string }> {
    constructor() {
        super();
        this.state = {answer: ""};
    }

    submit() {
        ajaxPost(`/user/${this.props.userId}/study-job/${this.props.jobId}/question/${this.props.jobItemId}`, {answer: this.state.answer}, (res) => {
            this.props.history.push(`/user/${this.props.userId}/study-job/${this.props.jobId}`)
        })
    }

    onChange(value) {
        this.setState({answer: value})
    }

    renderSingleChoice() {
        let sc = this.props.question.sc;
        let list = ["a", "b", "c", "d"].map(no => {
            return {value: no, option: sc[no]}
        });
        return <div>
            {this.props.question.title}
            <CheckGroup list={list} value={this.state.answer} onChange={this.onChange.bind(this)}/>
        </div>
    }

    renderTrueFalse() {
        let list = _.toPairs({"true": "正确", "false": "错误"}).map(p => {
            return {value: p[0], option: p[1]}
        });
        return <div>
            {this.props.question.title}
            <CheckGroup list={list} value={this.state.answer} onChange={this.onChange.bind(this)}/>
        </div>
    }

    render() {
        console.log(this.props.question);
        let question = null;
        if (this.props.question.ty == "sc") {
            question = this.renderSingleChoice();
        } else if (this.props.question.ty == "tf") {
            question = this.renderTrueFalse();
        }
        return <div>
            {question}
            <button onClick={this.submit.bind(this)}>提交</button>
        </div>
    }
}

export class UserStudyJobItem extends Component<RouteComponentProps<any>, { question: Question }> {
    constructor() {
        super();
        this.state = {question: null}
    }

    getItemId() {
        return this.props.match.params.id;
    }

    getJobId() {
        return this.props.match.params.jid;
    }

    getUid() {
        return this.props.match.params.uid;
    }

    componentDidMount() {
        ajaxGet(`/user/${this.getUid()}/study-job/${this.getJobId()}/item/${this.getItemId()}`, (res: StudentStudyJobItem) => {
            if (res.ty == "courseware") {
                ajaxGet(`/user/${this.getUid()}/study-job/${this.getJobId()}/courseware/${res.targetId}`, (courseware: Courseware) => {
                    location.href = `/upload/${courseware.fileId}`
                })
            } else if (res.ty == "video") {
                ajaxGet(`/user/${this.getUid()}/study-job/${this.getJobId()}/video/${res.targetId}`, (video: Video) => {
                    location.href = `/upload/${video.fileId}`
                })
            } else if (res.ty == "question") {
                ajaxGet(`/user/${this.getUid()}/study-job/${this.getJobId()}/question/${res.targetId}`, (question: Question) => {
                    this.setState({question});
                })
            }
        })
    }

    render() {
        if (this.state.question) {
            return <QuestionJob question={this.state.question}
                                userId={this.getUid()}
                                jobId={this.getJobId()}
                                jobItemId={this.getItemId()}
                                history={this.props.history}/>
        }
        return <div/>
    }
}

