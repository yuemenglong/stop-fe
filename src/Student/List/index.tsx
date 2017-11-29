import * as React from "react";
import {Component} from "react";
import {Route} from "react-router";
import {ListPageComponent, ListPageState} from "../../common/list-page-component";
import {Student} from "../../def/entity";
import {Link} from "react-router-dom";
import {Table} from "../../common/Table";
import {ajaxDelete} from "../../common/kit";

class State extends ListPageState<Student> {

}

export class StudentList extends ListPageComponent<Student, any, State> {
    constructor() {
        super();
        this.state = new State();
    }

    getDataUrl(): string {
        return "/student/list";
    }

    getCountUrl(): string {
        return "/student/count";
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
            ajaxDelete(`/student/${id}`, refresh)
        };
        let op = (s: Student) => {
            return <div>
                <Link to={`/student/${s.id}`}>查看</Link>
                <a href="javascript:void(0)" onClick={onDelete.bind(null, s.id)}>删除</a>
            </div>
        };
        let headers = [
            {name: "登录名", render: "loginName"},
            {name: "姓名", render: "userName"},
            {name: "手机", render: "mobile"},
            {name: "邮箱", render: "email"},
            {name: "操作", render: op}
        ];
        let getKey = (s) => s.id;
        return <div>
            <Link className="btn" to={"/student/init"}>新增</Link>
            <Table list={this.state.list} headers={headers} getKey={getKey}
                   props={{className: "table"}}/>
        </div>;
    }
}

