import * as React from "react";
import {Question} from "../../../def/entity";
import {EH, TEH} from "../../../common/render-component";
import {RenderPairComponent} from "../../../component/RenderPair/index";
import {Def} from "../../../def/data";
import {Kit} from "../../../common/kit";
import './style.less';

class State {
    question: Question = new Question();
}

interface Props {
    question: Question;
    onChange: TEH<Question>;
    onSubmit: EH;
    onCancel: EH;
    modalHeader: (item: string) => void;
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
        let map = Def.questionTypeMap;
        if (!this.props.question.id) {
            return this.renderPairSelect("ty", "题目类型", map)
        } else {
            return <span className={'question-type'}>{map[this.props.question.ty]}</span>
        }
    }

    render() {
        return <div  className={'modal-content question-modal-add'}>
            {this.props.modalHeader('新增题目')}
            <div className={'modal-body'}>
                {this.renderType()}
                {this.renderPairSelect("cate0Id", "一级类别", Kit.optionValueList(this.props.cate0, "name", "id"))}
                {this.renderPairSelect("cate1Id", "二级类别", Kit.optionValueList(this.props.cate1.filter(c => c.parentId == this.props.question.cate0Id), "name", "id"))}
                {this.renderPairTextArea("title", "题目")}
                {this.renderPairInputText("score", "分值")}
                {this.renderContent()}
            </div>
            <div className={'modal-footer'}>
                <button onClick={this.props.onCancel} className={'btn btn-default'}>取消</button>
                <button onClick={this.props.onSubmit} className={'btn btn-primary'}>保存</button>
            </div>
        </div>
    }
}

