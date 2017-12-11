import * as React from "react";
import {RouteComponentProps} from "react-router";
import {Component} from "react";
import {ajaxGet, ajaxPost} from "../../common/kit";
import {Courseware, Question, StudentStudyJobItem, Video} from "../../def/entity";
import {CheckGroup} from "../../component/CheckGroup/index";

interface Props {
    jobItemId: string,
    userId: string,
    question: Question,
    history: any,
}

class QuestionJob extends Component<Props, { answer: string }> {
    constructor() {
        super();
        this.state = {answer: ""};
    }

    submit() {
        ajaxPost(`/user/${this.props.userId}/study-job-item`, {answer: this.state.answer}, (res) => {
            console.log(res);
        })
    }

    renderSingleChoice() {
        let sc = this.props.question.sc;
        let list = ["a", "b", "c", "d"].map(no => {
            return {value: no, option: sc[no]}
        });
        let onChange = (value) => {
            this.setState({answer: value})
        };
        return <div>
            {this.props.question.title}
            <CheckGroup list={list} value={this.state.answer} onChange={onChange}/>
            <button onClick={this.submit.bind(this)}>提交</button>
        </div>
    }

    renderTrueFalse() {
        return <div>
            {this.props.question.title}
        </div>
    }

    render() {
        console.log(this.props.question);
        if (this.props.question.ty == "sc") {
            return this.renderSingleChoice();
        } else if (this.props.question.ty == "tf") {
            return this.renderTrueFalse();
        }
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
                    console.log(courseware);
                    alert();
                    location.href = `/upload/${courseware.fileId}`
                })
            } else if (res.ty == "video") {
                ajaxGet(`/user/${this.getUid()}/study-job/${this.getJobId()}/video/${res.targetId}`, (video: Video) => {
                    console.log(video);
                    alert();
                    location.href = `/upload/${video.fileId}`
                })
            } else if (res.ty == "question") {
                ajaxGet(`/user/${this.getUid()}/study-job/${this.getJobId()}/question/${res.targetId}`, (question: Question) => {
                    console.log(question);
                    alert();
                    this.setState({question});
                })
            }
        })
    }

    render() {
        if (this.state.question) {
            return <QuestionJob question={this.state.question}
                                jobItemId={this.getItemId()}
                                userId={this.getUid()}
                                history={this.props.history}/>
        }
        return <div/>
    }
}

