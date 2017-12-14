import * as React from "react";
import {Component} from "react";
import {Route} from "react-router";
import {ListPageComponent, ListPageState} from "../../../common/list-page-component";
import {Clazz} from "../../../def/entity";
import {Link} from "react-router-dom";
import {Table} from "../../../common/Table";
import {ajaxDelete} from "../../../common/kit";
import {ClazzEdit} from "../Edit/index";

class State extends ListPageState<Clazz> {

}

export class ClazzList extends ListPageComponent<Clazz, any, State> {
    constructor() {
        super();
        this.state = new State();
    }

    getDataUrl(): string {
        return "/clazz/list";
    }

    getCountUrl(): string {
        return "/clazz/count";
    }

    initFilter(): Object {
        return {};
    }

    errorHandler(res: any): any {
        alert(res.responseText)
    }

    getPageRange(): number {
        return 4;
    }

    renderPage(renderPagination: () => any, refresh: (e?: any) => void, swtch: (page: number) => void): any {
        let onDelete = (id) => {
            ajaxDelete(`/clazz/${id}`, refresh)
        };
        let op = (s: Clazz) => {
            return <div>
                <Link to={`/clazz/${s.id}`}>修改名称</Link>
                <a href="javascript:void(0)" onClick={onDelete.bind(null, s.id)}>删除</a>
                <Link to={`/clazz/${s.id}/student`}>学生管理</Link>
            </div>
        };
        let headers = [
            {name: "班级名称", render: "name"},
            {name: "班级人数", render: "studentCount"},
            {name: "操作", render: op}
        ];
        let getKey = (s) => s.id;
        return <div>
            <Route path="/clazz/:id" exact={true} component={ClazzEdit}/>
            <Link className="btn" to={"/clazz/init"}>新增</Link>
            <Table list={this.state.list} headers={headers} getKey={getKey}
                   props={{className: "table"}}/>
        </div>;
    }
}

