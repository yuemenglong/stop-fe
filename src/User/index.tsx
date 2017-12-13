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

export class UserRoute extends Component<RouteComponentProps<any>> {
    getUid() {
        return this.props.match.params.uid;
    }

    render() {
        return <div className="container">
            <div>
                <Link to={`/user/${this.getUid()}/study-job`}>学习任务</Link>
                <Link to={`/user/${this.getUid()}/team`}>查看队伍</Link>
            </div>
            <Route path="/user/:uid/study-job" exact={true} component={UserStudyJobList}/>
            <Route path="/user/:uid/study-job/:jid" exact={true} component={UserStudyJob}/>
            <Route path="/user/:uid/study-job/:jid/item/:id" component={UserStudyJobItem}/>
            <Route path="/user/:uid/team" exact={true} component={UserTeam}/>
            <Route path="/user/:uid/team/init" component={UserTeamInit}/>
            <Route path="/user/:uid/team/join" component={UserTeamJoin}/>
        </div>
    }
}

