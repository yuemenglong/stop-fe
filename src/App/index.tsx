import * as React from "react";
import {Component} from "react";
import {Route} from "react-router";
import {CourseEdit} from "../Course/Edit/index";
import {PageIndex} from "../Page/Index/index";
import {CourseList} from "../Course/List/index";

export class App extends Component {
    render() {
        return <div className="container">
            <switch>
                <Route path="/course/:id" component={CourseEdit}/>
                <Route path="/course" exact={true} component={CourseList}/>
                <Route path="/" exact={true} component={PageIndex}/>
            </switch>
        </div>
    }
}

