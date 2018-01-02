import * as React from "react";
import {Component} from "react";
import {RouteComponentProps} from "react-router";
import {Link} from "react-router-dom";
import {ListPageComponent, ListPageProps, ListPageState} from "../../../common/list-page-component";
import {Quiz} from "../../../def/entity";
import {JVOID0} from "../../../def/data";
import {CurdComponent, CurdState} from "../../../common/curd-component";
import {EH, TEH} from "../../../common/render-component";

class QuizListInner extends CurdComponent<Quiz> {
    constructor(props) {
        super(props);
        this.state = new CurdState<Quiz>();
    }

    idField(): string {
        return "id"
    }

    urlSlice(): number {
        return 3;
    }

    getHeaderRender(onCreate: EH, onUpdate: TEH<Quiz>, onDelete: TEH<Quiz>): Array<{ name: string; render: any }> {
        return [{
            name: "名称", render: "name",
        }, {
            name: "班级", render: "clazz.name",
        }, {
            name: "截止日期", render: "limitDate",
        }, {
            name: "操作", render: (item) => {
                return <div>
                    <a href={JVOID0} onClick={onDelete.bind(null, item)}>删除</a>
                    <Link to={`/teacher/quiz/${item.id}`}>查看题目</Link>
                    <Link to={`/teacher/quiz/${item.id}/jobs`}>查看完成情况</Link>
                </div>
            }
        }]
    }

    renderContent(renderTable: () => any, renderModal: () => any, onCreate: EH, onUpdate: TEH<Quiz>, onDelete: TEH<Quiz>): any {
        return <div>
            {renderTable()}
        </div>
    }

    itemConstructor(): Quiz {
        return undefined;
    }

    renderModalContent(onChange: TEH<Quiz>, onSubmit: EH, onCancel: EH): any {
        return undefined;
    }

    getRenderRootMode(): { root: any; mode: string; onChange?: Function } {
        return undefined;
    }

}

export class QuizList extends ListPageComponent<Quiz> {
    getDataUrl(): string {
        return `/teacher/quiz/list`;
    }

    getCountUrl(): string {
        return `/teacher/quiz/count`;
    }

    initFilter(): Object {
        return {};
    }

    getPageRange(): number {
        return 4;
    }

    renderPage(renderPagination: () => any, refresh: (e?: any) => void, swtch: (page: number) => void): any {
        let onChange = (list) => {
            this.setState({list})
        };
        return <div>
            <h1>Quiz List</h1>
            <QuizListInner
                match={this.props.match}
                history={this.props.history}
                onChange={onChange}
                list={this.state.list}/>
            <Link to={`/teacher/quiz/init`}>新增</Link>
        </div>
    }

    constructor(props) {
        super(props);
        this.state = new ListPageState<Quiz>();
    }
}
