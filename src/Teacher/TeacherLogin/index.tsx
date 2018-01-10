import * as React from "react";
import {RenderPairComponent} from "../../component/RenderPair/index";
import {ajaxPost} from "../../common/kit";
import {RouteComponentProps} from "react-router";

class State {
    user = {};
}

export class TeacherLogin extends RenderPairComponent<RouteComponentProps<any>, State> {
    getRenderRootMode(): { root: any; mode: string; onChange?: Function } {
        return {root: this.state, mode: "state"}
    }

    constructor() {
        super();
        this.state = new State;
    }

    render() {
        let login = () => {
            ajaxPost(`/teacher/login`, this.state.user, (user) => {
                this.props.history.push(`/teacher/course-category`)
            })
        };
        return <div>
            <h1>Login Page</h1>
            {this.renderPairInputText("user.username", "用户名")}
            {this.renderPairInputPassword("user.password", "密码")}
            <button onClick={login}>登录</button>
        </div>
    }
}

