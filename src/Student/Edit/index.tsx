import * as React from "react";
import {Component} from "react";
import {Route, RouteComponentProps} from "react-router";
import {RenderPairComponent} from "../../component/RenderPair/index";
import {Modal} from "../../common/modal";
import {WebUploader} from "../../component/WebUploader/index";
import {Student} from "../../def/entity";
import _ = require("lodash");
import {ajax, ajaxGet, ajaxPost, ajaxPut} from "../../common/kit";
import {Link} from "react-router-dom";

class State {
    student: Student = new Student()
}

export class StudentEdit extends RenderPairComponent<RouteComponentProps<any>, State> {
    constructor() {
        super();
        this.state = new State();
    }

    getRenderRootMode(): { root: any; mode: string } {
        return {root: this.state, mode: "state"}
    }

    componentDidMount() {
        if (this.getId() != "init") {
            ajaxGet(`/student/${this.getId()}`, (res) => {
                this.setState({student: res})
            })
        }
    }

    getId() {
        return this.props.match.params.id;
    }

    render() {
        let onUpload = (file) => {
            let student = _.defaults({avatar: file.fileId}, this.state.student);
            this.setState({student});
        };
        let submit = () => {
            if (this.getId() == "init") {
                ajaxPost(`/student`, this.state.student, () => {
                    location.href = "/student"
                })
            } else {
                ajaxPut(`/student/${this.getId()}`, this.state.student, () => {
                    location.href = "/student"
                })
            }
        };
        return <Modal>
            {this.renderPairInputText("student.loginName", "登录名")}
            {this.renderPairInputText("student.userName", "姓名")}
            {this.renderPairInputText("student.mobile", "手机")}
            {this.renderPairInputText("student.email", "邮箱")}
            <WebUploader id="uploader" onChange={onUpload}/>
            <button className="btn" onClick={submit}>确定</button>
            <Link className="btn" to="/student">取消</Link>
        </Modal>
    }
}

