import * as React from "react";
import {Component} from "react";
import {Route, RouteComponentProps} from "react-router";
import {Link} from "react-router-dom";
import {UserStudyJobList} from "./UserJobList/index";
import {UserStudyJob} from "./UserJob/index";
import {UserStudyJobItem} from "./UserJobItem/index";
import {UserTeam} from "./Team/index";
import {UserTeamJoin} from "./TeamJoin/index";
import {UserTeamInit} from "./TeamInit/index";
import {UserLogin} from "./UserLogin/index";
import {JVOID0} from "../def/data";
import {ajaxGet} from "../common/kit";

export class UserApp extends Component {
    getUid() {
        let m = location.pathname.match(/^\/user\/(\d+).*$/);
        console.log(m);
        if (!m) {
            return;
        }
        return m[1];
    }

    renderNavs() {
        let uid = this.getUid();
        let logout = () => {
            ajaxGet(`/user/logout`, () => {
                location.href = `/login`
            })
        };
        if (uid) {
            return <div>
                <Link to={`/user/${uid}/study-job`}>学习任务</Link>
                <Link to={`/user/${uid}/team`}>查看队伍</Link>
                <a href={JVOID0} onClick={logout}>注销</a>
            </div>
        } else {
            return null;
        }
    }

    render() {
        return <div className="container">
            {this.renderNavs()}
            <switch>
                <Route path="/user/:uid/study-job" exact={true} component={UserStudyJobList}/>
                <Route path="/user/:uid/study-job/:jid" exact={true} component={UserStudyJob}/>
                <Route path="/user/:uid/study-job/:jid/item/:id" exact={true} component={UserStudyJobItem}/>
                <Route path="/user/:uid/team" exact={true} component={UserTeam}/>
                <Route path="/user/:uid/team/init" component={UserTeamInit}/>
                <Route path="/user/:uid/team/join" component={UserTeamJoin}/>
                <Route path="/login" component={UserLogin}/>
                <Route path="/" exact={true} component={UserLogin}/>
            </switch>
        </div>
    }
}

