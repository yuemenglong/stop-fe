import * as React from "react";
import {Component} from "react";
import {Route} from "react-router";
import {ListPageComponent, ListPageState} from "../../common/list-page-component";
import {Student} from "../../def/entity";
import {Link} from "react-router-dom";
import {Table} from "../../common/Table";
import {ajaxDelete} from "../../common/kit";
import {CurdComponent} from "../../common/curd-component";
import {EH, TEH} from "../../common/render-component";
import {JVOID0} from "../../def/data";
import {update} from "../../common/updater";
import {WebUploader} from "../../component/WebUploader/index";

class State extends ListPageState<Student> {

}

class StudentListInner extends CurdComponent<Student> {
    idField(): string {
        return "id";
    }

    urlSlice(): number {
        return 2;
    }

    getHeaderRender(onCreate: EH, onUpdate: TEH<Student>, onDelete: TEH<Student>): Array<{ name: string; render: any }> {
        let op = (s: Student) => {
            return <div>
                <a href={JVOID0} onClick={onUpdate.bind(null, s)}>查看</a>
                <a href={JVOID0} onClick={onDelete.bind(null, s)}>删除</a>
                {/*<Link to={`/student/${s.id}`}>查看</Link>*/}
                {/*<a href="javascript:void(0)" onClick={onDelete.bind(null, s.id)}>删除</a>*/}
            </div>
        };
        return [
            {name: "登录名", render: "loginName"},
            {name: "姓名", render: "userName"},
            {name: "手机", render: "mobile"},
            {name: "邮箱", render: "email"},
            {name: "操作", render: op}
        ];
    }

    renderContent(renderTable: () => any, renderRoute: () => any, onCreate: EH, onUpdate: TEH<Student>, onDelete: TEH<Student>): any {
        return <div>
            <h1>学生列表</h1>
            {renderTable()}
            {renderRoute()}
            <button onClick={onCreate}>新增</button>
        </div>;
    }

    itemConstructor(): Student {
        return new Student();
    }

    renderModalContent(onChange: TEH<Student>, onSubmit: EH, onCancel: EH): any {
        let onUpload = (file) => {
            let item = update(this.state.item, "avatar", file.fileId);
            onChange(item);
            // let student = _.defaults({avatar: file.fileId}, this.state.student);
            // this.setState({student});
        };
        return <div>
            {this.renderPairInputText("item.loginName", "登录名")}
            {this.renderPairInputText("item.userName", "姓名")}
            {this.renderPairInputText("item.mobile", "手机")}
            {this.renderPairInputText("item.email", "邮箱")}
            <WebUploader id="uploader" onChange={onUpload}/>
            <button className="btn" onClick={onSubmit}>确定</button>
            <button className="btn" onClick={onCancel}>取消</button>
        </div>
    }

    getRenderRootMode(): { root: any; mode: string; onChange?: Function } {
        return {root: this.state, mode: "state"};
    }
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
        // let onDelete = (id) => {
        //     ajaxDelete(`/student/${id}`, refresh)
        // };
        // let op = (s: Student) => {
        //     return <div>
        //         <Link to={`/student/${s.id}`}>查看</Link>
        //         <a href="javascript:void(0)" onClick={onDelete.bind(null, s.id)}>删除</a>
        //     </div>
        // };
        // let headers = [
        //     {name: "登录名", render: "loginName"},
        //     {name: "姓名", render: "userName"},
        //     {name: "手机", render: "mobile"},
        //     {name: "邮箱", render: "email"},
        //     {name: "操作", render: op}
        // ];
        // let getKey = (s) => s.id;
        let onChange = (list) => {
            console.log("onChange", list);
            // this.setState(list);
            // TODO 这里用setState不起作用，还没有搞清楚原因
            (this.state as any).list = list;
            this.setState(list);
        };
        console.log("render", this.state.list);
        return <div>
            <StudentListInner history={this.props.history} list={this.state.list}
                              onChange={onChange}/>
            {/*<Link className="btn" to={"/student/init"}>新增</Link>*/}
            {/*<Table list={this.state.list} headers={headers} getKey={getKey}*/}
            {/*props={{className: "table"}}/>*/}
        </div>;
    }
}

