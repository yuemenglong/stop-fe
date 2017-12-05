import * as React from "react";
import {Component} from "react";
import {Route, RouteComponentProps} from "react-router";
import {CourseList} from "./List/index";
import {CourseInfo} from "./Info/index";
import {CoursewareList} from "./CoursewareList/index";
import {VideoList} from "./VideoList/index";
import {QuestionList} from "./QuestionList/index";
import {QuestionInfo} from "./QuestionInfo/index";

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
        // let renderCourseInfo = (props) => <CourseInfo {...props}/>;
        return <div>
            <Route path="/course" exact={true} component={CourseList}/>
            <Route path="/course/:id" render={renderHeader}/>
            <Route path="/course/:id" exact={true} component={CourseInfo}/>
            <Route path="/course/:id/courseware" component={CoursewareList}/>
            <Route path="/course/:id/video" component={VideoList}/>
            <Route path="/course/:id/question" component={QuestionList}/>
            <Route path="/course/:id/question/:qid" component={QuestionInfo}/>
        </div>
    }
}

