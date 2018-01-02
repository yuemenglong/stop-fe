import * as React from "react";
import {Student, StudentStudyJob, StudentStudyJobItem, StudyJob} from "../../def/entity";
import {Component} from "react";
import {RouteComponentProps} from "react-router";
import {ajaxGet, ajaxPut} from "../../common/kit";
import {Def} from "../../def/data";
import {Table} from "../../common/Table";
import {Link} from "react-router-dom";
import {RenderPairComponent} from "../../component/RenderPair/index";
import {FileInfo, WebUploader} from "../../component/WebUploader/index";
import {update} from "../../common/updater";
import {Chosen} from "../../component/Chosen/index";
import _ = require("lodash");

class State {
    user: Student = new Student();
}

export class UserHome extends RenderPairComponent<RouteComponentProps<any>, State> {
    getRenderRootMode(): { root: any; mode: string; onChange?: Function } {
        return {root: this.state, mode: "state"}
    }

    constructor(props) {
        super(props);
        this.state = new State();
    }

    getUid() {
        return this.props.match.params.uid;
    }

    componentDidMount() {
        ajaxGet(location.pathname, (user) => {
            console.log(user);
            this.setState({user})
        })
    }

    renderAvater() {
        let avater = this.state.user.avatar;
        console.log(avater);
        let img = null;
        if (avater != null) {
            img = <img src={`/upload/${avater}`}/>
        }
        let onChange = (info: FileInfo) => {
            ajaxPut(`/user/${this.getUid()}`, {avatar: info.fileId}, () => {
                let state = update(this.state, "user.avatar", info.fileId);
                this.setState(state);
            })
        };
        let accept = {extensions: "jpg,jpeg", mimeTypes: "image/*"};
        return <div>
            {img}
            <WebUploader key={avater || ""} onChange={onChange} text="上传头像"
                         accept={accept}/>
        </div>
    }

    render() {
        let list = [1, 2, 3].map(i => {
            return {value: i, option: i}
        });
        return <div>
            {this.renderAvater()}
            {this.renderPairText("user.name", "姓名")}
            {this.renderPairText("user.mobile", "电话")}
            {this.renderPairText("user.email", "邮箱")}
            {this.renderPairText("user.clazz.name", "班级")}
            {this.renderPairText("user.team.name", "团队")}
        </div>
    }
}

