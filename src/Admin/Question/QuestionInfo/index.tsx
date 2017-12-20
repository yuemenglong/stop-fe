import * as React from "react";
import {Question} from "../../../def/entity";
import {EH, TEH} from "../../../common/render-component";
import {RenderPairComponent} from "../../../component/RenderPair/index";
import {questionTypeMap} from "../../../def/data";
import {Kit} from "../../../common/kit";

class State {
    question: Question = new Question();
}

interface Props {
    question: Question;
    onChange: TEH<Question>;
    onSubmit: EH;
    onCancel: EH;
    cate0: any;
    cate1: any;
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
        return <div>
            {this.renderType()}
            {this.renderPairSelect("cate0Id", "一级类别", Kit.optionValueList(this.props.cate0, "name", "id"))}
            {this.renderPairSelect("cate1Id", "二级类别", Kit.optionValueList(this.props.cate1.filter(c => c.parentId == this.props.question.cate0Id), "name", "id"))}
            {this.renderPairTextArea("title", "题目")}
            {this.renderPairInputText("score", "分值")}
            {this.renderContent()}
            <button onClick={this.props.onSubmit}>保存</button>
            <button onClick={this.props.onCancel}>取消</button>
        </div>
    }
}

