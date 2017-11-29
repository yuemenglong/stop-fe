import * as React from "react";
import {Component} from "react";
import {Link} from "react-router-dom";

export class PageIndex extends Component {
    render() {
        return <div>
            <Link to="/course">课程列表</Link>
            <Link to="/student">学生列表</Link>
        </div>
    }
}
