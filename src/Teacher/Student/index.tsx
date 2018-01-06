import * as React from "react";
import {ListPageComponent, ListPageState} from "../../common/list-page-component";
import {CurdComponent, CurdState} from "../../common/curd-component";
import {Student} from "../../def/entity";
import {EH, TEH} from "../../common/render-component";
import {JVOID0} from "../../def/data";
import {update} from "../../common/updater";
import {WebUploader} from "../../component/WebUploader/index";
import {ajaxGet} from "../../common/kit";
import _ = require("lodash");

class State extends ListPageState<Student> {

}

class StudentListInner extends CurdComponent<Student> {
    constructor() {
        super();
        this.state = new CurdState<Student>();
    }

    componentDidMount() {
        ajaxGet(`/teacher/clazz/list?limit=99999&offset=0&fields=name`, (res) => {
            let clazzMap = _.fromPairs(res.map(c => [c.id, c.name]));
            let state = update(this.state, "data.clazzMap", clazzMap);
            this.setState(state)
        })
    }

    idField(): string {
        return "id";
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
            {name: "登录名", render: "user.username"},
            {name: "姓名", render: "name"},
            {name: "手机", render: "mobile"},
            {name: "邮箱", render: "email"},
            {
                name: "班级", render: (item) => {
                return (this.state.data.clazzMap || {})[item.clazzId]
            }
            },
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
        return <div>
            {this.renderPairInputText("item.user.username", "登录名")}
            {this.renderPairInputPassword("item.user.password", "密码")}
            {this.renderPairInputText("item.name", "姓名")}
            {this.renderPairInputText("item.mobile", "手机")}
            {this.renderPairInputText("item.email", "邮箱")}
            <button className="btn" onClick={onSubmit}>确定</button>
            <button className="btn" onClick={onCancel}>取消</button>
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

