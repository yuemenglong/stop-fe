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
import {Table} from "../../../common/Table";
import './style.less';


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
        return <div className='modal-content'>
            <div className='modal-header'>选择题目</div>
            <div className='modal-body'>
                <table className="table table-striped table-bordered dataTable">
                    <thead>
                    <tr>{['', '题目内容', '题型'].map((header: string, i: number) => {
                        return <td key={i}>{header}</td>
                    })}</tr>
                    </thead>
                    <tbody>{this.props.list.map(renderItem)}</tbody>
                </table>
            </div>
            <div className='modal-footer'>
                <div className={'checked-all'}>
                    <input type="checkbox" checked={checkedAll} onChange={onChangeAll}/>
                    <span>全选</span>
                </div>
                <button onClick={this.props.onCancel} className='btn btn-primary'>确认</button>
            </div>
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
            this.setState({cateCount: res})
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
            let questions = this.state.questions.concat(this.state.selected);
            let selected = [];
            let selectors = null;
            this.setState({questions, selected, selectors})
        };
        return <Modal className='teacher-quiz-edit-modal-con'>
            <Selector list={this.state.selectors}
                      onChange={onChange}
                      selected={this.state.selected}
                      maxSelect={10000}
                      onCancel={onCancel}
            />
        </Modal>
    }

    renderHeaders() {
        return <tr>{['一级类别', '二级类别', '共有题目(个)', '已选题目(个)', '已选题目内容', '操作'].map((item: string, idx: number) => {
            return <td key={idx}>{item}</td>
        })}</tr>
    }

    renderItems(item: Category, idx: number) {
        let onClick = (cate1Id) => {
            ajaxGet(`/admin/question/list?cate1Id=${cate1Id}`, (res) => {
                let questions = this.state.questions.filter(q => q.cate1Id != cate1Id);
                let selected = this.state.questions.filter(q => q.cate1Id == cate1Id);
                this.setState({selectors: res, selected, questions})
            })
        };
        let children = (c: Category) => {
            let cateCount = this.state.cateCount;
            let questions = this.state.selected.filter(q => q.cate1Id == c.id);
            let choice = match(this.isInit(), {
                true: <a href={JVOID0} onClick={onClick.bind(null, c.id)}>选择</a>,
                false: null,
            });
            let questionsCon = questions.map(q => {
                return <div key={q.id}>{q.title}</div>
            });
            let values = [_.get(c, 'name', ''), _.get(cateCount, c.id, 0),
                _.get(questions, 'length', 0), questionsCon, choice];
            return values.map((v: any, i: number) => {
                let title = i + 1 == values.length ? '' : v;
                return <td key={i} title={title}>{v}</td>
            })
        };
        let childLength = _.get(item, 'children.length', 0);
        let oneClazzName = _.get(item, 'name', '');
        let tr1 = <tr key={idx}>
            <td rowSpan={childLength} title={oneClazzName}>{oneClazzName}</td>
            {children(item.children[0])}
        </tr>;
        let tr2 = item.children.slice(1).map((child: Category, i: number) => {
            return <tr key={i}>{children(child)}</tr>
        });
        return childLength > 1 ? [tr1, tr2] : tr1;
    }

    renderQuestion() {
        return <table className='table table-striped table-bordered dataTable teacher-quiz-edit-tables'>
            <thead>{this.renderHeaders()}</thead>
            <tbody>{this.state.cates.map(this.renderItems.bind(this))}</tbody>
        </table>
    }

    renderQuestions() {
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
                    let questions = this.state.selected.filter(q => q.cate1Id == cate1.id);
                    // noinspection ReservedWordAsName
                    let choice = match(this.isInit(), {
                        true: <a href={JVOID0} onClick={onClick.bind(null, cate1.id)}>选择</a>,
                        false: null,
                    });
                    return <div key={cate1.id}>
                        <h5>二级类别{cate1.name}</h5>
                        <span>共有{this.state.cateCount[cate1.id] || 0}题</span>
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
        let subBtn = this.isInit() ? <button onClick={submit} className='btn btn-primary'>提交</button> : null;
        let location = this.state.disabled ? "查看题目" : '新增题目';
        return <div className='teacher-quiz-edit-con'>
            <div>{"当前位置：考试任务 > " + location}</div>
            <div className={'box'}>
                {this.renderPairInputText("quiz.name", "名称")}
                {this.renderPairSelect("quiz.clazzId", "选择班级", Kit.optionValueList(this.state.clazzes))}
                {this.renderPairDatePicker("quiz.limitDate", "截止日期")}
                {this.renderQuestion()}
                {this.renderSelector()}
                <div className={'quiz-edit-btns'}>
                    {subBtn}
                    <Link to={`/teacher/quiz`}>返回</Link>
                </div>
            </div>
        </div>
    }

}

