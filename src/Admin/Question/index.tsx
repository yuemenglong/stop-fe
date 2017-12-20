import * as React from "react";
import _ = require("lodash");
import {ListPageComponent, ListPageState} from "../../common/list-page-component";
import {CurdComponent, CurdState} from "../../common/curd-component";
import {EH, TEH} from "../../common/render-component";
import {JVOID0, questionTypeMap} from "../../def/data";
import {FileInfo, WebUploader} from "../../component/WebUploader/index";
import {Question} from "../../def/entity";
import {QuestionInfo} from "./QuestionInfo/index";
import {ajaxGet} from "../../common/kit";
import {update} from "../../common/updater";

class QuestionListInner extends CurdComponent<Question> {
    constructor(props) {
        super(props);
        this.state = new CurdState<Question>();
    }

    itemConstructor(): Question {
        let ret = new Question();
        ret.ty = "sc";
        return ret;
    }

    renderModalContent(onChange: TEH<Question>,
                       onSubmit: EH,
                       onCancel: EH): any {
        return <QuestionInfo onCancel={onCancel}
                             onSubmit={onSubmit}
                             onChange={onChange}
                             question={this.state.item}
                             cate0={this.props.data.cate0}
                             cate1={this.props.data.cate1}/>
    }

    urlSlice(): number {
        return 3;
    }

    idField(): string {
        return "id";
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

    renderContent(renderTable: () => any,
                  renderModal: () => any,
                  onCreate: EH,
                  onUpdate: TEH<Question>,
                  onDelete: TEH<Question>): any {
        return <div>
            {renderTable()}
            {renderModal()}
            <button onClick={onCreate}>新增</button>
        </div>
    }

    getRenderRootMode(): { root: any; mode: string } {
        return {root: this.state, mode: "state"};
    }
}

export class QuestionList extends ListPageComponent<Question> {
    constructor(props) {
        super(props);
        this.state = new ListPageState<Question>();
    }

    componentDidMount() {
        ajaxGet(`/admin/category?ty=question&level=0`, (res) => {
            let data = update(this.state.data, "cate0", res);
            this.setState({data});
        });
        ajaxGet(`/admin/category?ty=question&level=1`, (res) => {
            let data = update(this.state.data, "cate1", res);
            this.setState({data});
        })
    }

    getDataUrl(): string {
        return "/admin/question/list";
    }

    getCountUrl(): string {
        return "/admin/question/count";
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
            <QuestionListInner
                list={this.state.list}
                onChange={onChange}
                history={this.props.history}
                data={this.state.data}/>
            {renderPagination()}
        </div>
    }

    getRenderRootMode(): { root: any; mode: string } {
        return {root: this.state, mode: "state"};
    }
}

