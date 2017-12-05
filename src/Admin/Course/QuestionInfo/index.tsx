import * as React from "react";
import {Table} from "../../../common/Table";
import {ajax} from "../../../common/kit";
import {Course, Courseware, Question, Video} from "../../../def/entity";
import {Modal} from "../../../common/modal";
import {RenderPairComponent} from "../../../component/RenderPair/index";
import {FileInfo, WebUploader} from "../../../component/WebUploader/index";
import * as _ from "lodash";
import {RouteComponentProps} from "react-router";
import {Simulate} from "react-dom/test-utils";
import submit = Simulate.submit;
import {questionTypeMap} from "../../../def/data";
import {Link} from "react-router-dom";

class State {
    question: Question = new Question();
}


export class QuestionInfo extends RenderPairComponent<RouteComponentProps<any>, State> {
    getRenderRootMode(): { root: any; mode: string } {
        return {root: this.state, mode: "state"};
    }

    getCid() {
        return this.props.match.params.id;
    }

    getQid() {
        return this.props.match.params.qid;
    }

    constructor() {
        super();
        this.state = new State();
    }

    componentDidMount() {
        if (this.getQid() != "init") {
            ajax({
                url: `/course/${this.getCid()}/question/${this.getQid()}`,
                type: "GET",
                success: (q) => {
                    this.setState({question: q})
                }
            })
        } else {
            let question = _.defaults({ty: "sc"}, this.state.question);
            this.setState({question: question})
        }
    }

    renderContent() {
        if (this.state.question.ty == "sc") {
            let answerMap = {
                "": "请选择",
                "1": "选项1",
                "2": "选项2",
                "3": "选项3",
                "4": "选项4",
            };
            return <div>
                {this.renderPairInputText("question.sc.opt1", "选项1")}
                {this.renderPairInputText("question.sc.opt2", "选项2")}
                {this.renderPairInputText("question.sc.opt3", "选项3")}
                {this.renderPairInputText("question.sc.opt4", "选项4")}
                {this.renderPairSelect("question.sc.answer", "正确答案", answerMap)}
            </div>
        } else if (this.state.question.ty == "tf") {
            let answerMap = {
                "": "请选择",
                "true": "正确",
                "false": "错误",
            };
            return <div>
                {this.renderPairSelect("question.tf.answer", "正确答案", answerMap)}
            </div>
        }
    }

    renderType() {
        let map = questionTypeMap;
        if (this.getQid() == "init") {
            return this.renderPairSelect("question.ty", "题目类型", map)
        } else {
            return <span>{map[this.state.question.ty]}</span>
        }
    }

    render() {
        if (!this.state.question) {
            return <Modal/>
        }
        let submit = () => {
            let qt = this.state.question;
            console.log(qt);
            if (qt.ty == "sc") {
                delete qt.tf;
            } else if (qt.ty == "tf") {
                delete qt.sc;
            }
            if (this.getQid() == "init") {
                ajax({
                    url: `/course/${this.getCid()}/question`,
                    type: "POST",
                    data: JSON.stringify(qt),
                    success: () => {
                        location.href = `/course/${this.getCid()}/question`
                    }
                })
            } else {
                ajax({
                    url: `/course/${this.getCid()}/question/${this.getQid()}`,
                    type: "PUT",
                    data: JSON.stringify(qt),
                    success: () => {
                        location.href = `/course/${this.getCid()}/question`
                    }
                })
            }
        };
        return <Modal>
            <h1>新增题目</h1>
            {this.renderType()}
            {this.renderPairTextArea("question.title", "题目")}
            {this.renderPairInputText("question.score", "分值")}
            {this.renderContent()}
            <Link to={`/course/${this.getCid()}/question`}>取消</Link>
            <button onClick={submit}>保存</button>
        </Modal>
    }
}

