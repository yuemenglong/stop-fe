import * as React from "react";
import {Table} from "../../../common/Table";
import {ajax, ajaxGet} from "../../../common/kit";
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
        ajaxGet("/teacher/course/" + this.getCid(), (res) => {
                this.setState({course: res})
            }
        )
    }

    render() {
        let onChange = (list) => {
            let state = update(this.state, "course.questions", list);
            this.setState(state)
        };
        return <QuestionListInner history={this.props.history} onChange={onChange}
                                  list={this.state.course.questions}/>
    }
}

