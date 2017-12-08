import * as React from "react";
import {RouteComponentProps} from "react-router";
import {Component} from "react";
import {ajax, ajaxGet} from "../../common/kit";
import {Courseware, Question, StudentStudyJobItem, Video} from "../../def/entity";

class QuestionJob extends Component<{ question: Question }, { answer: string }> {
    constructor() {
        super();
        this.state = {answer: ""};
    }

    renderSingleChoice() {

    }

    renderTrueFalse() {

    }

    render() {
        return <div>
            {this.props.question.title}
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

    getUid() {
        return this.props.match.params.uid;
    }

    componentDidMount() {
        ajaxGet(`/user/${this.getUid()}/study-job-item/${this.getItemId()}`, (res: StudentStudyJobItem) => {
            if (res.ty == "courseware") {
                ajaxGet(`/user/${this.getUid()}/courseware/${res.targetId}`, (courseware: Courseware) => {
                    location.href = `/upload/${courseware.fileId}`
                })
            } else if (res.ty == "video") {
                ajaxGet(`/user/${this.getUid()}/video/${res.targetId}`, (video: Video) => {
                    location.href = `/upload/${video.fileId}`
                })
            } else if (res.ty == "question") {
                ajaxGet(`/user/${this.getUid()}/question/${res.targetId}`, (question: Question) => {
                    console.log(question)
                })

            }
        })
    }

    render() {
        if (this.state.question) {
            return <QuestionJob question={this.state.question}/>
        }
        return <div/>
    }
}

