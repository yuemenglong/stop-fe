import * as React from "react";
import {Component} from "react";
import {Route} from "react-router";
import {QuizEdit} from "./Edit/index";
import {QuizList} from "./List/index";
import {QuizJobList} from "./JobList/index";

export class QuizRouter extends Component {
    render() {
        return <div>
            <Route path="/teacher/quiz" exact={true} component={QuizList}/>
            <Route path="/teacher/quiz/:qid" exact={true} component={QuizEdit}/>
            <Route path="/teacher/quiz/:qid/jobs" exact={true} component={QuizJobList}/>
        </div>
    }
}
