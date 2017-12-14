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
import {EH, TEH} from "../../../common/render-component";

class State {
    question: Question = new Question();
}

interface Props {
    question: Question;
    onChange: TEH<Question>;
    onSubmit: EH;
    onCancel: EH;
}

export class QuestionInfo extends RenderPairComponent<Props, State> {
    getRenderRootMode(): { root: any; mode: string } {
        return {root: this.props.question, mode: "props"};
    }

    // getCid() {
    //     return this.props.match.params.id;
    // }
    //
    // getQid() {
    //     return this.props.match.params.qid;
    // }

    constructor() {
        super();
        this.state = new State();
    }

    // componentDidMount() {
    //     if (this.getQid() != "init") {
    //         ajax({
    //             url: `/course/${this.getCid()}/question/${this.getQid()}`,
    //             type: "GET",
    //             success: (q) => {
    //                 this.setState({question: q})
    //             }
    //         })
    //     } else {
    //         let question = _.defaults({ty: "sc"}, this.props.question);
    //         this.setState({question: question})
    //     }
    // }

    renderContent() {
        if (this.props.question.ty == "sc") {
            let answerMap = {
                "": "请选择",
                "a": "选项1",
                "b": "选项2",
                "c": "选项3",
                "d": "选项4",
            };
            return <div>
                {this.renderPairInputText("sc.a", "选项1")}
                {this.renderPairInputText("sc.b", "选项2")}
                {this.renderPairInputText("sc.c", "选项3")}
                {this.renderPairInputText("sc.d", "选项4")}
                {this.renderPairSelect("answer", "正确答案", answerMap)}
            </div>
        } else if (this.props.question.ty == "tf") {
            let answerMap = {
                "": "请选择",
                "true": "正确",
                "false": "错误",
            };
            return <div>
                {this.renderPairSelect("answer", "正确答案", answerMap)}
            </div>
        }
    }

    renderType() {
        let map = questionTypeMap;
        if (!this.props.question.id) {
            return this.renderPairSelect("ty", "题目类型", map)
        } else {
            return <span>{map[this.props.question.ty]}</span>
        }
    }

    render() {
        // if (!this.props.question) {
        //     return <Modal/>
        // }
        // let submit = () => {
        //     let qt = this.props.question;
        //     console.log(qt);
        //     if (qt.ty == "tf") {
        //         delete qt.sc;
        //     }
        //     if (this.getQid() == "init") {
        //         ajax({
        //             url: `/course/${this.getCid()}/question`,
        //             type: "POST",
        //             data: JSON.stringify(qt),
        //             success: () => {
        //                 location.href = `/course/${this.getCid()}/question`
        //             }
        //         })
        //     } else {
        //         ajax({
        //             url: `/course/${this.getCid()}/question/${this.getQid()}`,
        //             type: "PUT",
        //             data: JSON.stringify(qt),
        //             success: () => {
        //                 location.href = `/course/${this.getCid()}/question`
        //             }
        //         })
        //     }
        // };
        return <div>
            {this.renderType()}
            {this.renderPairTextArea("title", "题目")}
            {this.renderPairInputText("score", "分值")}
            {this.renderContent()}
            <button onClick={this.props.onSubmit}>保存</button>
            <button onClick={this.props.onCancel}>取消</button>
        </div>
    }
}

