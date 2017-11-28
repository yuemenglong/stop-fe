import * as React from "react";
import {Component} from "react";
import {Route} from "react-router";
import {CourseInfo} from "./Info/index";
import {CourseList} from "../List/index";
import {CoursewareList} from "./Courseware/index";
import {BaseProps} from "../../common/common-type";

export class CourseEdit extends Component<BaseProps> {
    render() {
        let cid = this.props.match.params.id;
        let coursewareList = () => <CoursewareList cid={cid}/>;
        let courseInfo = () => <CourseInfo cid={cid}/>;
        return <div>
            <div>
                <a href={`/course/${cid}`}>课程信息</a>
                <a href={`/course/${cid}/courseware`}>课件列表</a>
                <a href={`/course/${cid}/video`}>视频列表</a>
                <a href={`/course/${cid}/question`}>题目列表</a>
            </div>
            <div>
                <Route path="/course/:id/courseware" exact={true} render={coursewareList}/>
                <Route path="/course/:id" exact={true} render={courseInfo}/>
            </div>
        </div>
    }
}

