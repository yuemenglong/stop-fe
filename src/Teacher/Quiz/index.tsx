import * as React from "react";
import {Component} from "react";
import {Route} from "react-router";
import {QuizInit} from "./Init/index";
import {QuizList} from "./List/index";

export class QuizRouter extends Component {
    render() {
        return <div>
            <Route path="/teacher/quiz" exact={true} component={QuizList}/>
            <Route path="/teacher/quiz/init" exact={true} component={QuizInit}/>
        </div>
    }
}
