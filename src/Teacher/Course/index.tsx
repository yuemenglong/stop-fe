import * as React from "react";
import {Component} from "react";
import {Route, RouteComponentProps} from "react-router";
import {CourseList} from "./List/index";
import {CourseInfo} from "./Info/index";
import {VideoList} from "./Video/index";
import {QuestionList} from "./Question/index";
import {CourseItemList} from "./ItemList/index";

export class CourseRouter extends Component {
    render() {
        let renderHeader = (props: RouteComponentProps<any>) => {
            let cid = props.match.params.id;
            return <div>
                <a href={`/teacher/course/${cid}`}>课程信息</a>
                <a href={`/teacher/course/${cid}/courseware`}>课件列表</a>
                <a href={`/teacher/course/${cid}/video`}>视频列表</a>
                <a href={`/teacher/course/${cid}/question`}>题目列表</a>
            </div>;
        };
        return <div>
            <Route path="/teacher/course" exact={true} component={CourseList}/>
            <Route path="/teacher/course/:id" render={renderHeader}/>
            <Route path="/teacher/course/:id" exact={true} component={CourseInfo}/>
            <Route path="/teacher/course/:id/courseware" component={CourseItemList}/>
            <Route path="/teacher/course/:id/video" component={CourseItemList}/>
            <Route path="/teacher/course/:id/question" component={CourseItemList}/>
        </div>
    }
}

