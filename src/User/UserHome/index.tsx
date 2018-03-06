import * as React from "react";
import {FileInfo, Student, StudentStudyJob, StudentStudyJobItem, StudyJob} from "../../def/entity";
import {Component} from "react";
import {RouteComponentProps} from "react-router";
import {ajaxGet, ajaxPut} from "../../common/kit";
import {Def} from "../../def/data";
import {Table} from "../../common/Table";
import {Link} from "react-router-dom";
import {RenderPairComponent} from "../../component/RenderPair/index";
import {WebUploader} from "../../component/WebUploader/index";
import {update} from "../../common/updater";
import {Chosen} from "../../component/Chosen/index";
import _ = require("lodash");
import "./style.less";

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
            this.setState({user})
        })
    }

    renderAvater() {
        let avatar = _.get(this.state, "user.avatar.fileId");
        let imgSrc = avatar != null ? `/upload/${avatar}` : "/deploy/imgs/user/head_pic.png";
        // let img = null;
        // if (avatar != null) {
        //     img = <img src={`/upload/${avatar}`}/>
        // }
        let onChange = (info: FileInfo) => {
            ajaxPut(`/user/${this.getUid()}`, {avatar: info}, () => {
                let state = update(this.state, "user.avatar", info);
                this.setState(state);
            })
        };
        let accept = {extensions: "jpg,jpeg,png,bmp", mimeTypes: "image/*"};
        return <div className='user-home-img pull-left'>
            {/*{img}*/}
            <img src={imgSrc} className='head-pic'/>
            <WebUploader key={avatar || ""} onChange={onChange} text="上传头像"
                         accept={accept}/>
        </div>
    }

    render() {
        let list = [1, 2, 3].map(i => {
            return {value: i, option: i}
        });
        return <div className='user-home'>
            <div>当前位置：个人资料</div>
            <div className='box'>
                {this.renderAvater()}
                <div className='user-home-texts pull-left'>
                    {this.renderPairText("user.name", "姓名：")}
                    {this.renderPairText("user.mobile", "电话：")}
                    {this.renderPairText("user.email", "邮箱：")}
                    {this.renderPairText("user.clazz.name", "班级：")}
                    {this.renderPairText("user.team.name", "团队：")}
                </div>
            </div>
        </div>
    }
}

