import * as React from "react";
import {RenderPairComponent} from "../../component/RenderPair/index";
import {ajaxPost, Kit} from "../../common/kit";
import {RouteComponentProps} from "react-router";
import {WebUploader} from "../../component/WebUploader/index";
import "./style.less";

class State {
    user = {};
}

export class UserLogin extends RenderPairComponent<RouteComponentProps<any>, State> {
    getRenderRootMode(): { root: any; mode: string; onChange?: Function } {
        return {root: this.state, mode: "state"}
    }

    constructor() {
        super();
        this.state = new State;
    }

    render() {
        let login = () => {
            ajaxPost(`/user/login`, this.state.user, (user) => {
                this.props.history.push(`/user/${user.id}`)
            })
        };
        return <div className='login-box user-login'>
            <div className={'login-logo'}><h1>学生登录</h1></div>
            <div className={'login-box-body'}>
                <div className={'form-group has-feedback'}>
                    {this.renderInputText("user.username", "用户名")}
                    <span className={'glyphicon glyphicon-envelope form-control-feedback'}/>
                </div>
                <div className={'form-group has-feedback'}>
                    {this.renderInputPassword("user.password", "密码")}
                    <span className={'glyphicon glyphicon-lock form-control-feedback'}/>
                </div>
                <button onClick={login} className={'btn btn-primary btn-block'}>登录</button>
            </div>
        </div>
    }
}

