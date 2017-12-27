import * as React from "react";
import {Component} from "react";
import {RouteComponentProps} from "react-router";
import {ajax, ajaxGet, ajaxPost, Kit} from "../../../common/kit";
import {Category, Clazz, Question} from "../../../def/entity";
import {JVOID0, questionTypeMap} from "../../../def/data";
import {SelectorComponent, SelectorProps} from "../../../common/selector-component";
import {EH} from "../../../common/render-component";
import {Modal} from "../../../common/modal";
import _ = require("lodash");
import {RenderPairComponent} from "../../../component/RenderPair/index";


interface SProps extends SelectorProps<Question> {
    onCancel: () => any
}

class Selector extends SelectorComponent<Question, SProps> {
    itemKey(item: Question): string {
        return item.id.toString();
    }

    renderItem(item: Question, idx: number, key: string, checked: boolean, onChange: EH): any {
        let ty = questionTypeMap[item.ty];
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
    cateCount: Object = {};
    cates: Array<Category> = [];
    questions: Array<Question> = [];
    selected: Array<Question> = [];
    selectors: Array<Question> = null;
    clazzes: Array<Clazz> = [];
}

export class QuizInit extends RenderPairComponent<RouteComponentProps<any>, State> {
    getRenderRootMode(): { root: any; mode: string; onChange?: Function } {
        return {root: this.state, mode: "state"}
    }

    constructor(props) {
        super(props);
        this.state = new State();
    }

    componentDidMount() {
        ajaxGet(`/admin/question/cate-count`, (res) => {
            this.setState({cateCount: res})
        });
        ajaxGet(`/admin/category?ty=question`, (res) => {
            this.setState({cates: res})
        });
        ajaxGet(`/teacher/clazz/list`, (res) => {
            console.log(res);
            this.setState({clazzes: res})
        });
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
            let questions = this.state.questions.concat(this.state.selected);
            let selected = [];
            let selectors = null;
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

    renderQuestion() {
        let onClick = (cate1Id) => {
            ajaxGet(`/admin/question/list?cate1Id=${cate1Id}`, (res) => {
                let questions = this.state.questions.filter(q => q.cate1Id != cate1Id);
                let selected = this.state.questions.filter(q => q.cate1Id == cate1Id);
                this.setState({selectors: res, selected, questions})
            })
        };
        return this.state.cates.map((cate0: Category) => {
            return <div key={cate0.id}>
                <h3>一级类别{cate0.name}</h3>
                {cate0.children.map(cate1 => {
                    let questions = this.state.questions.concat(this.state.selected).filter(q => q.cate1Id = cate1.id);
                    return <div key={cate1.id}>
                        <h5>二级类别{cate1.name}</h5>
                        <span>共有{this.state.cateCount[cate1.id]}题</span>
                        <a href={JVOID0} onClick={onClick.bind(null, cate1.id)}>选择</a>
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
            ajaxPost(`/teacher/quiz`, data, (res) => {
                this.props.history.push(`/teacher/quiz`);
            })
        };
        return <div>
            {this.renderPairInputText("quiz.name", "名称")}
            {this.renderPairSelect("quiz.clazzId", "选择班级", Kit.optionValueList(this.state.clazzes))}
            {this.renderQuestion()}
            {this.renderSelector()}
            <button onClick={submit}>提交</button>
        </div>
    }

}
