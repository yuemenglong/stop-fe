import * as React from "react";
import {Component} from "react";
import {Route} from "react-router";
import {ListPageComponent, ListPageState} from "../../../common/list-page-component";
import {Clazz} from "../../../def/entity";
import {Link} from "react-router-dom";
import {CurdComponent, CurdState} from "../../../common/curd-component";
import {EH, TEH, validateRegex} from "../../../common/render-component";
import {JVOID0} from "../../../def/data";
import {_teacherLeftLocation} from "../../../common/common-method";
import '../style.less';

class State extends ListPageState<Clazz> {

}

class ClazzListInner extends CurdComponent<Clazz> {
    constructor() {
        super();
        this.state = new CurdState<Clazz>();
    }

    idField(): string {
        return "id"
    }

    urlSlice(): number {
        return 3;
    }

    getHeaderRender(onCreate: EH, onUpdate: TEH<Clazz>, onDelete: TEH<Clazz>): Array<{ name: string; render: any }> {
        let op = (clazz: Clazz) => {
            return <div className={'clazz-list-table-btns'}>
                <a href={JVOID0} onClick={onUpdate.bind(null, clazz)}>修改名称</a>
                <a href={JVOID0} onClick={onDelete.bind(null, clazz)}>删除</a>
                <Link to={`/teacher/clazz/${clazz.id}/student`}>学生管理</Link>
            </div>
        };
        return [
            {name: "班级名称", render: "name"},
            {name: "班级人数", render: "studentCount"},
            {name: "操作", render: op}
        ];
    }

    renderContent(renderTable: () => any, renderModal: () => any, onCreate: EH, onUpdate: TEH<Clazz>, onDelete: TEH<Clazz>): any {
        return <div className={'teacher-clazz-list'}>
            <div>{"当前位置：" + _teacherLeftLocation}</div>
            <div className={'box'}>
                <button onClick={onCreate} className={'btn bg-orange btn-add'}>新增</button>
                {renderTable()}
                {renderModal()}
            </div>
        </div>;
    }

    itemConstructor(): Clazz {
        let ret = new Clazz();
        ret.studentCount = 0;
        return ret;
    }

    getRenderValidator() {
        let re = validateRegex;
        return {
            item: {
                name: re(/\S+/, "请输入班级名称")
            }
        }
    }


    renderModalContent(onChange: TEH<Clazz>, onSubmit: EH, onCancel: EH, modalHeader: (item: string) => void): any {
        return <div className={'modal-content clazz-list-modal-con'}>
            {modalHeader('新增班级')}
            <div className={'modal-body'}>{this.renderPairInputText("item.name", "班级名称")}</div>
            <div className={'modal-footer'}>
                <button className="btn btn-default" onClick={onCancel}>取消</button>
                <button className="btn btn-primary" onClick={onSubmit}>确定</button>
            </div>
        </div>
    }

    getRenderRootMode(): { root: any; mode: string; onChange?: Function } {
        return {root: this.state, mode: "state"}
    }
}

export class ClazzList extends ListPageComponent<Clazz, any, State> {
    constructor() {
        super();
        this.state = new State();
    }

    getDataUrl(): string {
        return "/teacher/clazz/list";
    }

    getCountUrl(): string {
        return "/teacher/clazz/count";
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
        //     ajaxDelete(`/clazz/${id}`, refresh)
        // };
        // let op = (s: Clazz) => {
        //     return <div>
        //         <Link to={`/clazz/${s.id}`}>修改名称</Link>
        //         <a href="javascript:void(0)" onClick={onDelete.bind(null, s.id)}>删除</a>
        //         <Link to={`/clazz/${s.id}/student`}>学生管理</Link>
        //     </div>
        // };
        // let headers = [
        //     {name: "班级名称", render: "name"},
        //     {name: "班级人数", render: "studentCount"},
        //     {name: "操作", render: op}
        // ];
        // let getKey = (s) => s.id;
        let onChange = (list) => {
            this.setState({list})
        };
        return <div className={'teacher-clazz-con'}>
            {/*<Route path="/clazz/:id" exact={true} component={ClazzEdit}/>*/}
            {/*<Link className="btn" to={"/clazz/init"}>新增</Link>*/}
            {/*<Table list={this.state.list} headers={headers} getKey={getKey}*/}
            {/*props={{className: "table"}}/>*/}
            <ClazzListInner history={this.props.history} onChange={onChange} list={this.state.list}/>
        </div>;
    }
}

