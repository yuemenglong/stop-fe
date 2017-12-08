import * as React from "react";
import {Component} from "react";
import {Route, RouteComponentProps} from "react-router";
import {Link} from "react-router-dom";
import {UserStudyJobList} from "./StudyJobList/index";
import {UserStudyJob} from "./StudyJob/index";
import {UserStudyJobItem} from "./StudyJobItem/index";

export class UserRoute extends Component<RouteComponentProps<any>> {
    getUid() {
        return this.props.match.params.uid;
    }

    render() {
        return <div className="container">
            <div>
                <Link to={`/user/${this.getUid()}/study-job`}>学习任务</Link>
            </div>
            <Route path="/user/:uid/study-job" exact={true} component={UserStudyJobList}/>
            <Route path="/user/:uid/study-job/:jid" component={UserStudyJob}/>
            <Route path="/user/:uid/study-job-item/:id" component={UserStudyJobItem}/>
        </div>
    }
}

