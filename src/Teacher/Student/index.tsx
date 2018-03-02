import * as React from "react";
import {ListPageComponent, ListPageState} from "../../common/list-page-component";
import {CurdComponent, CurdState} from "../../common/curd-component";
import {Student} from "../../def/entity";
import {EH, TEH} from "../../common/render-component";
import {JVOID0} from "../../def/data";
import {update} from "../../common/updater";
import {WebUploader} from "../../component/WebUploader/index";
import './style.less';
import {_teacherLeftLocation} from "../../common/common-method";

class State extends ListPageState<Student> {

}

class StudentListInner extends CurdComponent<Student> {
    constructor() {
        super();
        this.state = new CurdState<Student>();
    }

    idField(): string {
        return "id";
    }

    urlSlice(): number {
        return 3;
    }

    getHeaderRender(onCreate: EH, onUpdate: TEH<Student>, onDelete: TEH<Student>): Array<{ name: string; render: any }> {
        let op = (s: Student) => {
            return <div className={'student-table-btns'}>
                <a href={JVOID0} onClick={onUpdate.bind(null, s)}>查看</a>
                <a href={JVOID0} onClick={onDelete.bind(null, s)}>删除</a>
                {/*<Link to={`/student/${s.id}`}>查看</Link>*/}
                {/*<a href="javascript:void(0)" onClick={onDelete.bind(null, s.id)}>删除</a>*/}
            </div>
        };
        return [
            {name: "登录名", render: "user.username"},
            {name: "姓名", render: "name"},
            {name: "手机", render: "mobile"},
            {name: "邮箱", render: "email"},
            {name: "操作", render: op}
        ];
    }

    renderContent(renderTable: () => any, renderRoute: () => any, onCreate: EH, onUpdate: TEH<Student>, onDelete: TEH<Student>): any {
        return <div className={'teacher-student-con'}>
            <div>{"当前位置：" + _teacherLeftLocation}</div>
            <div className={'box'}>
                <button onClick={onCreate} className={'btn bg-orange btn-add'}>新增</button>
                {renderTable()}
                {renderRoute()}
            </div>
        </div>;
    }

    itemConstructor(): Student {
        return new Student();
    }

    renderModalContent(onChange: TEH<Student>, onSubmit: EH, onCancel: EH, modalHeader: (item: string) => void): any {
        let onUpload = (file) => {
            let item = update(this.state.item, "avatar", file.fileId);
            onChange(item);
            // let student = _.defaults({avatar: file.fileId}, this.state.student);
            // this.setState({student});
        };
        let inb = {display: "inline-block"};
        let file = <div style={inb}><WebUploader onChange={onUpload}/></div>;
        if (this.state.item.avatar) {
            file = <div style={inb}>
                <img src={`/upload/${this.state.item.avatar}`} style={{width: 200, height: 200}}/>
            </div>
        }
        return <div className={'modal-content teacher-student-modal-con'}>
            {modalHeader('新增学生')}
            <div className={'modal-body'}>
                <div className={'head-img'}><span>头像</span>{file}</div>
                {this.renderPairInputText("item.user.username", "登录名")}
                {this.renderPairInputPassword("item.user.password", "密码")}
                {this.renderPairInputText("item.name", "姓名")}
                {this.renderPairInputText("item.mobile", "手机")}
                {this.renderPairInputText("item.email", "邮箱")}
            </div>
            <div className={'modal-footer'}>
                <button className="btn btn-default" onClick={onCancel}>取消</button>
                <button className="btn btn-primary" onClick={onSubmit}>确定</button>
            </div>
        </div>
    }

    getRenderRootMode(): { root: any; mode: string; onChange?: Function } {
        return {root: this.state, mode: "state"};
    }
}

export class StudentList extends ListPageComponent<Student, any, State> {
    constructor(props) {
        super(props);
        this.state = new State();
    }

    getDataUrl(): string {
        return "/teacher/student/list";
    }

    getCountUrl(): string {
        return "/teacher/student/count";
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
        let onChange = (list) => {
            this.setState({list});
        };
        return <div>
            <StudentListInner history={this.props.history} list={this.state.list}
                              onChange={onChange}/>
        </div>;
    }
}

