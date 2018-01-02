import * as React from "react";
import {Component} from "react";
import {Route, RouteComponentProps} from "react-router";
import {QuizJobList} from "./List/index";
import {QuizJobInfo} from "./Info/index";

export class QuizJobRouter extends Component {

    render() {
        return <div className="container">
            <Route path="/user/:uid/quiz-job" exact={true} component={QuizJobList}/>
            <Route path="/user/:uid/quiz-job/:jid" exact={true} component={QuizJobInfo}/>
        </div>
    }
}

