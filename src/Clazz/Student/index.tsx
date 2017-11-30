import * as React from "react";
import {Component} from "react";
import {Route, RouteComponentProps} from "react-router";
import {RenderPairComponent} from "../../component/RenderPair/index";
import {Modal} from "../../common/modal";
import {WebUploader} from "../../component/WebUploader/index";
import {Clazz, Student} from "../../def/entity";
import _ = require("lodash");
import {ajax, ajaxGet, ajaxPost, ajaxPut} from "../../common/kit";
import {Link} from "react-router-dom";
import {Table} from "../../common/Table";

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
        let headers = [
            {name: "姓名", render: "userName"},
            {name: "电话", render: "mobile"},
            {name: "邮箱", render: "email"},
        ];
        return <div>
            <Link to={`/clazz/${this.getId()}/student/select`}>添加学生</Link>
            <Table className="table" list={this.state.students} headers={headers}/>
        </div>
    }
}

