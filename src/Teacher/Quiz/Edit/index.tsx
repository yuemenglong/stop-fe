import * as React from "react";
import {Component} from "react";
import {RouteComponentProps} from "react-router";
import {ajax, ajaxGet, ajaxPost, Kit, match} from "../../../common/kit";
import {Category, Clazz, Question, Quiz} from "../../../def/entity";
import {JVOID0, Def} from "../../../def/data";
import {SelectorComponent, SelectorProps} from "../../../common/selector-component";
import {EH} from "../../../common/render-component";
import {Modal} from "../../../common/modal";
import _ = require("lodash");
import {RenderPairComponent} from "../../../component/RenderPair/index";
import {Link} from "react-router-dom";


interface SProps extends SelectorProps<Question> {
    onCancel: () => any
}

class Selector extends SelectorComponent<Question, SProps> {
    itemKey(item: Question): string {
        return item.id.toString();
    }

    renderItem(item: Question, idx: number, key: string, checked: boolean, onChange: EH): any {
        let ty = Def.questionTypeMap[item.ty];
        return <tr key={key}>
            <td>
                <input type="checkbox" onChange={onChange} checked={checked}/>
            </td>
            <td>{item.title}</td>
            <td>{ty}</td>
        </tr>
    }

    renderContent(renderItem: (item: Question, idx: number) => any, checkedAll: boolean, onChangeAll: () => void): any {
        return <div>
            <table className="table">
                <tbody>
                {this.props.list.map(renderItem)}
                </tbody>
            </table>
            <input type="checkbox" checked={checkedAll} onChange={onChangeAll}/>
            <span>全选</span>
            <button onClick={this.props.onCancel}>完成</button>
        </div>;
    }

    getRenderRootMode(): { root: any; mode: string; onChange?: Function } {
        return {root: this.state, mode: "state"};
    }
}

class State {
    quiz: { clazzId: string, name: string } = {clazzId: ""} as any;
    cateCountMap: Object = {};
    cates: Array<Category> = [];
    questions: Array<Question> = []; // 本次考试对应的题目
    selected: Array<Question> = []; // 面板中选中的题目
    selectors: Array<Question> = null; // 面板中待选的题目
    clazzes: Array<Clazz> = [];
    disabled: boolean = false;
}

export class QuizEdit extends RenderPairComponent<RouteComponentProps<any>, State> {
    getRenderRootMode(): { root: any; mode: string; onChange?: Function } {
        return {root: this.state, mode: "state"}
    }

    getQid() {
        return this.props.match.params.qid
    }

    constructor(props) {
        super(props);
        this.state = new State();
    }

    isInit() {
        return this.getQid() == "init"
    }

    componentDidMount() {
        ajaxGet(`/admin/question/cate-count`, (res) => {
            this.setState({cateCountMap: res})
        });
        ajaxGet(`/admin/category?ty=question`, (res) => {
            this.setState({cates: res})
        });
        ajaxGet(`/teacher/clazz/list`, (res) => {
            this.setState({clazzes: res})
        });
        if (!this.isInit()) {
            this.setState({disabled: true});
            ajaxGet(`/teacher/quiz/${this.getQid()}`, (res: Quiz) => {
                let selected = res.questions.map(q => {
                    return q.question;
                });
                this.setState({quiz: res as any, selected})
            })
        }
    }

    renderSelector() {
        if (!this.state.selectors) {
            return;
        }
        if (!this.state.selectors.length) {
            alert("无题目");
            return;
        }
        let onChange = (list) => {
            this.setState({selected: list})
        };
        let onCancel = () => {
            console.log("onCancel", this.state.questions, this.state.selected);
            let questions = this.state.questions.concat(this.state.selected);
            let selected = [];
            let selectors = null;
            console.log("onCancel: Questions", questions);
            this.setState({questions, selected, selectors})
        };
        return <Modal>
            <Selector list={this.state.selectors}
                      onChange={onChange}
                      selected={this.state.selected}
                      maxSelect={10000}
                      onCancel={onCancel}
            />
        </Modal>
    }

    renderQuestions() {
        let onClick = (cate1Id) => {
            ajaxGet(`/admin/question/list?cate1Id=${cate1Id}`, (res) => {
                // 提交的时候会再加上，不然concat会把已经删除的又加回来
                let questions = this.state.questions.filter(q => q.cate1Id != cate1Id);
                let selected = this.state.questions.filter(q => q.cate1Id == cate1Id);
                this.setState({selectors: res, selected, questions})
            })
        };
        console.log(this.state.selected, this.state.cates);
        return this.state.cates.map((cate0: Category) => {
            return <div key={cate0.id}>
                <h3>一级类别{cate0.name}</h3>
                {cate0.children.map(cate1 => {
                    let questions = this.state.questions.concat(this.state.selected).filter(q => q.cate1Id == cate1.id);
                    // noinspection ReservedWordAsName
                    let choice = match(this.isInit(), {
                        true: <a href={JVOID0} onClick={onClick.bind(null, cate1.id)}>选择</a>,
                        false: null,
                    });
                    return <div key={cate1.id}>
                        <h5>二级类别{cate1.name}</h5>
                        <span>共有{this.state.cateCountMap[cate1.id] || 0}题</span>
                        <span>选择{questions.length}题</span>
                        {choice}
                        {questions.map(q => {
                            return <div key={q.id}>
                                {q.title}
                            </div>
                        })}
                    </div>
                })}
            </div>
        })
    }

    render() {
        let submit = () => {
            // clazzId + QuizQuestion
            let data = _.clone(this.state.quiz) as any;
            data.questions = this.state.questions.map(q => {
                let ret = {} as any;
                ret.questionId = q.id;
                return ret;
            });
            ajaxPost(`/teacher/quiz`, data, () => {
                this.props.history.push(`/teacher/quiz`);
            })
        };
        let subBtn = this.isInit() ? <button onClick={submit}>提交</button> : null;
        return <div>
            {this.renderPairInputText("quiz.name", "名称")}
            {this.renderPairSelect("quiz.clazzId", "选择班级", Kit.optionValueList(this.state.clazzes))}
            {this.renderPairDatePicker("quiz.limitDate", "截止日期")}
            {this.renderQuestions()}
            {this.renderSelector()}
            {subBtn}
            <Link to={`/teacher/quiz`}>返回</Link>
        </div>
    }

}

