import * as React from "react";
import {Component} from "react";
import {Route, RouteComponentProps} from "react-router";
import {CourseList} from "../Course/List/index";
import {CourseInfo} from "./Info/index";
import {CoursewareList} from "./Courseware/index";

export class CourseRouter extends Component {
    render() {
        let renderHeader = (props: RouteComponentProps<any>) => {
            let cid = props.match.params.id;
            return <div>
                <a href={`/course/${cid}`}>课程信息</a>
                <a href={`/course/${cid}/courseware`}>课件列表</a>
                <a href={`/course/${cid}/video`}>视频列表</a>
                <a href={`/course/${cid}/question`}>题目列表</a>
            </div>;
        };
        let renderCourseInfo = (props) => <CourseInfo {...props}/>;
        return <div className="container">
            <switch>
                <Route path="/course" exact={true} component={CourseList}/>
                <Route path="/course/:id" render={renderHeader}/>
                <Route path="/course/:id" exact={true} render={renderCourseInfo}/>
                <Route path="/course/:id/courseware" exact={true} component={CoursewareList}/>
            </switch>
        </div>
    }
}

