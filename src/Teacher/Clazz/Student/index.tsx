import * as React from "react";
import {RouteComponentProps} from "react-router";
import {RenderPairComponent} from "../../../component/RenderPair/index";
import {Student} from "../../../def/entity";
import {ajaxDelete, ajaxGet, ajaxPost, ajaxPut} from "../../../common/kit";
import {CurdComponent, CurdState} from "../../../common/curd-component";
import {EH, TEH} from "../../../common/render-component";
import {JVOID0} from "../../../def/data";
import {ClazzStudentSelector} from "../Selector/index";

class State {
    students: Array<Student> = [];
}

class ClazzStudentInner extends CurdComponent<Student> {
    constructor() {
        super();
        this.state = new CurdState<Student>();
    }

    idField(): string {
        return "id"
    }

    urlSlice(): number {
        return 5;
    }

    getHeaderRender(onCreate: EH, onUpdate: TEH<Student>, onDelete: TEH<Student>): Array<{ name: string; render: any }> {
        return [
            {name: "姓名", render: "userName"},
            {name: "电话", render: "mobile"},
            {name: "邮箱", render: "email"},
            {name: "班级", render: "clazzId"},
            {
                name: "操作", render: (student) => {
                return <a href={JVOID0} onClick={onDelete.bind(null, student)}>删除</a>
            }
            },
        ];
    }

    renderContent(renderTable: () => any, renderModal: () => any, onCreate: EH, onUpdate: TEH<Student>, onDelete: TEH<Student>): any {
        return <div>
            <a href={JVOID0} onClick={onCreate}>添加学生</a>
            {renderTable()}
            {renderModal()}
        </div>
    }

    itemConstructor(): Student {
        return new Student();
    }

    renderModalContent(onChange: TEH<Student>, onSubmit: EH, onCancel: EH): any {
        let onSelect = (selected) => {
            this.props.onChange(this.props.list.concat(selected));
            onCancel();
        };
        return <ClazzStudentSelector onCancel={onCancel} onSelect={onSelect} match={this.props.match}/>;
    }

    getRenderRootMode(): { root: any; mode: string; onChange?: Function } {
        return {root: this.state, mode: "mode"}
    }

}

export class ClazzStudent extends RenderPairComponent<RouteComponentProps<any>, State> {
    constructor() {
        super();
        this.state = new State();
    }

    getRenderRootMode(): { root: any; mode: string } {
        return {root: this.state, mode: "state"}
    }

    componentDidMount() {
        if (this.getId() != "init") {
            ajaxGet(`/teacher/clazz/${this.getId()}/students`, (res) => {
                this.setState({students: res})
            })
        }
    }

    getId() {
        return this.props.match.params.id;
    }

    render() {
        // let onDelete = (s) => {
        //     ajaxDelete(`/clazz/${this.getId()}/student/${s.id}`, () => {
        //         location.href = location.href;
        //     })
        // };
        // let headers = [
        //     {name: "姓名", render: "userName"},
        //     {name: "电话", render: "mobile"},
        //     {name: "邮箱", render: "email"},
        //     {name: "班级", render: "clazzId"},
        //     {
        //         name: "操作", render: (s) => {
        //         return <a href="javascript:void(0)" onClick={onDelete.bind(null, s)}>删除</a>
        //     }
        //     },
        // ];
        let onChange = (students) => {
            this.setState({students})
        };
        return <div>
            {/*<Link to={`/teacher/clazz/${this.getId()}/student/select`}>添加学生</Link>*/}
            {/*<Table className="table" list={this.state.students} headers={headers}/>*/}
            <ClazzStudentInner history={this.props.history} list={this.state.students} onChange={onChange}
                               match={this.props.match}/>
        </div>
    }
}

