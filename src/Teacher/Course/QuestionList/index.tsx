import * as React from "react";
import {Table} from "../../../common/Table";
import {ajax} from "../../../common/kit";
import {Course, Courseware, Question, Video} from "../../../def/entity";
import {Modal} from "../../../common/modal";
import {RenderPairComponent} from "../../../component/RenderPair/index";
import * as _ from "lodash";
import {RouteComponentProps} from "react-router";
import {Link} from "react-router-dom";
import {JVOID0, questionTypeMap} from "../../../def/data";
import {CurdComponent, CurdState} from "../../../common/curd-component";
import {EH, TEH} from "../../../common/render-component";
import {QuestionInfo} from "../QuestionInfo/index";
import {update} from "../../../common/updater";


class QuestionListInner extends CurdComponent<Question> {
    constructor() {
        super();
        this.state = new CurdState<Question>();
    }

    idField(): string {
        return "id";
    }

    urlSlice(): number {
        return 4;
    }

    getHeaderRender(onCreate: EH, onUpdate: TEH<Question>, onDelete: TEH<Question>): Array<{ name: string; render: any }> {
        return [{
            name: "题目", render: "title",
        }, {
            name: "类型", render: (item) => questionTypeMap[item.ty],
        }, {
            name: "分值", render: "score",
        }, {
            name: "操作", render: (item: Question) => <div>
                <a href={JVOID0} onClick={onUpdate.bind(null, item)}>查看</a>
                <a href={JVOID0} onClick={onDelete.bind(null, item)}>删除</a>
            </div>
        }];
    }

    renderContent(renderTable: () => any, renderModal: () => any, onCreate: EH, onUpdate: TEH<Question>, onDelete: TEH<Question>): any {
        return <div>
            {renderTable()}
            {renderModal()}
            <button onClick={onCreate}>新增</button>
        </div>
    }

    itemConstructor(): Question {
        let q = new Question();
        q.ty = "sc";
        return q;
    }

    renderModalContent(onChange: TEH<Question>, onSubmit: EH, onCancel: EH): any {
        return <QuestionInfo onSubmit={onSubmit} onCancel={onCancel} onChange={onChange} question={this.state.item}/>
    }

    getRenderRootMode(): { root: any; mode: string; onChange?: Function } {
        return {root: this.state, mode: "state"};
    }
}

class State {
    course: Course = new Course();
}

export class QuestionList extends RenderPairComponent<RouteComponentProps<any>, State> {
    getRenderRootMode(): { root: any; mode: string } {
        return {root: this.state, mode: "state"};
    }

    getCid() {
        return this.props.match.params.id;
    }

    constructor() {
        super();
        this.state = new State();
    }

    componentDidMount() {
        ajax({
            url: "/course/" + this.getCid(),
            type: "GET",
            success: (res) => {
                this.setState({course: res})
            }
        })
    }

    // renderModal() {
    //     if (!this.state.question) {
    //         return;
    //     }
    //     let submit = () => {
    //         ajax({
    //             url: `/course/${this.getCid()}/question`,
    //             type: "POST",
    //             data: JSON.stringify(this.state.question),
    //             success: (res) => {
    //                 let course = _.cloneDeep(this.state.course);
    //                 course.questions.push(res);
    //                 course.questionCount = course.questions.length;
    //                 this.setState({course, question: null});
    //             }
    //         })
    //     };
    //     return <Modal>
    //         {this.renderPairInputText("question.name", "名字")}
    //         <button onClick={submit}>确定</button>
    //     </Modal>
    // }

    render() {
        let onChange = (list) => {
            let state = update(this.state, "course.questions", list);
            this.setState(state)
        };
        return <QuestionListInner history={this.props.history} onChange={onChange}
                                  list={this.state.course.questions}/>
        // let onDelete = (item: Video) => {
        //     ajax({
        //         url: `/course/${this.getCid()}/question/${item.id}`,
        //         type: "DELETE",
        //         success: () => {
        //             // noinspection SillyAssignmentJS
        //             location.href = location.href;
        //         }
        //     })
        // };
        // let headers = [{
        //     name: "题目", render: "title",
        // }, {
        //     name: "类型", render: (item) => questionTypeMap[item.ty],
        // }, {
        //     name: "分值", render: "score",
        // }, {
        //     name: "操作", render: (item: Question) => <div>
        //         <Link to={`/course/${this.getCid()}/question/${item.id}`}>查看</Link>
        //         <a href="javascript:void(0)" onClick={onDelete.bind(this, item)}>删除</a>
        //     </div>
        // }];
        // return <div>
        //     <h1>题目</h1>
        //     <Table list={this.state.course.questions}
        //            headers={headers}
        //            props={{className: "table"}}/>
        //     <Link to={`/course/${this.getCid()}/question/init`} className="btn btn-primary">新增</Link>
        //     {this.renderModal()}
        // </div>
    }
}

