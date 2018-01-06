///<reference path="../../../node_modules/@types/lodash/index.d.ts"/>
import * as React from "react";
import {RouteComponentProps} from "react-router";
import {Component} from "react";
import {ajaxGet, ajaxPost} from "../../common/kit";
import {Courseware, Question, StudentStudyJobItem, Video} from "../../def/entity";
import {CheckGroup} from "../../component/CheckGroup/index";
import _ = require("lodash");

interface Props {
    question: Question,
    answer: string,
    onChange: (string) => any
    disabled?: boolean,
}

export class QuestionEdit extends Component<Props> {
    renderSingleChoice() {
        let sc = this.props.question.sc;
        let list = ["a", "b", "c", "d"].map(no => {
            return {value: no, option: sc[no]}
        });
        return <div>
            {this.props.question.title}
            <CheckGroup disabled={this.props.disabled} list={list} value={this.props.answer}
                        onChange={this.props.onChange}/>
        </div>
    }

    renderTrueFalse() {
        let list = _.toPairs({"true": "正确", "false": "错误"}).map(p => {
            return {value: p[0], option: p[1]}
        });
        return <div>
            {this.props.question.title}
            <CheckGroup disabled={this.props.disabled} list={list} value={this.props.answer}
                        onChange={this.props.onChange}/>
        </div>
    }

    render() {
        if (this.props.question.ty == "sc") {
            return this.renderSingleChoice();
        } else if (this.props.question.ty == "tf") {
            return this.renderTrueFalse();
        } else {
            throw Error("Unknown Question Type: " + this.props.question.ty)
        }
    }
}

export class UserStudyJobItem extends Component<RouteComponentProps<any>, { question: Question, answer: string }> {
    constructor() {
        super();
        this.state = {question: null, answer: ""}
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
                    location.href = `/upload/${courseware.file.fileId}`
                })
            } else if (res.ty == "video") {
                ajaxGet(`/user/${this.getUid()}/study-job/${this.getJobId()}/video/${res.targetId}`, (video: Video) => {
                    location.href = `/upload/${video.file.fileId}`
                })
            } else if (res.ty == "question") {
                ajaxGet(`/user/${this.getUid()}/study-job/${this.getJobId()}/question/${res.targetId}`, (question: Question) => {
                    this.setState({question});
                })
            }
        })
    }

    render() {
        if (!this.state.question) {
            return <div/>
        }
        // return <QuestionJob question={this.state.question}
        //                     userId={this.getUid()}
        //                     jobId={this.getJobId()}
        //                     jobItemId={this.getItemId()}
        //                     history={this.props.history}/>
        let onChange = (answer) => {
            this.setState({answer})
        };
        let submit = () => {
            ajaxPost(`/user/${this.getUid()}/study-job/${this.getJobId()}/question/${this.getItemId()}`,
                {answer: this.state.answer}, (res) => {
                    this.props.history.push(`/user/${this.getUid()}/study-job/${this.getJobId()}`)
                })
        };
        return <div>
            <QuestionEdit disabled={false} question={this.state.question} answer={this.state.answer}
                          onChange={onChange}/>
            <button onClick={submit}>提交</button>
        </div>
    }
}

