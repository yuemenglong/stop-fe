import * as React from "react";
import {RouteComponentProps} from "react-router";
import {RenderPairComponent} from "../../../component/RenderPair/index";
import {Student} from "../../../def/entity";
import {ajaxDelete, ajaxGet, ajaxPost, ajaxPut} from "../../../common/kit";
import {Link} from "react-router-dom";
import {Table} from "../../../common/Table";

class State {
    students: Array<Student> = [];
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
            ajaxGet(`/clazz/${this.getId()}/students`, (res) => {
                this.setState({students: res})
            })
        }
    }

    getId() {
        return this.props.match.params.id;
    }

    render() {
        let onDelete = (s) => {
            ajaxDelete(`/clazz/${this.getId()}/student/${s.id}`, () => {
                location.href = location.href;
            })
        };
        let headers = [
            {name: "姓名", render: "userName"},
            {name: "电话", render: "mobile"},
            {name: "邮箱", render: "email"},
            {name: "班级", render: "clazzId"},
            {
                name: "操作", render: (s) => {
                return <a href="javascript:void(0)" onClick={onDelete}>删除</a>
            }
            },
        ];
        return <div>
            <Link to={`/clazz/${this.getId()}/student/select`}>添加学生</Link>
            <Table className="table" list={this.state.students} headers={headers}/>
        </div>
    }
}

