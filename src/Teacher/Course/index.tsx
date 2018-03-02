import * as React from "react";
import {Component} from "react";
import {Route, RouteComponentProps} from "react-router";
import {CourseList} from "./List/index";
import {CourseInfo} from "./Info/index";
import {CourseItemList} from "./ItemList/index";
import {_teacherLeftLocation} from "../../common/common-method";
import * as _ from "lodash";

export class CourseRouter extends Component {
    render() {
        let pathname = window.location.pathname;
        let display = pathname == "/teacher/course" ? 'none' : "block";
        let urlTexts = (cid: string) => {
            return [{name: '课程信息', url: `/teacher/course/${cid}`},
                {name: '课件列表', url: `/teacher/course/${cid}/courseware`},
                {name: '视频列表', url: `/teacher/course/${cid}/video`},
                {name: '题目列表', url: `/teacher/course/${cid}/question`}]
        };
        let renderHeader = (props: RouteComponentProps<any>) => {
            let cid = props.match.params.id;
            return <ul className={'nav nav-tabs'}>{urlTexts(cid).map((item: any, idx: number) => {
                let liClass = item.url == pathname ? 'active' : "";
                return <li key={idx} className={liClass}><a href={item.url}>{item.name}</a></li>;
            })}</ul>;
        };
        let location = (props: RouteComponentProps<any>) => {
            let cid = props.match.params.id;
            let oneUrlText = urlTexts(cid).filter((item: any) => {
                return item.url == pathname;
            }) || [];
            let style = {display: display, marginBottom: "10px"};
            return <div style={style}>{"当前位置：课程列表 > " + _.get(oneUrlText[0], 'name', '')}</div>;
        };
        return <div>
            <Route path="/teacher/course" exact={true} component={CourseList}/>
            <Route path="/teacher/course/:id" render={location}/>
            <div className={'nav-tabs-custom'} style={{display: display}}>
                <Route path="/teacher/course/:id" render={renderHeader}/>
                <div className={'tab-content'}>
                    <Route path="/teacher/course/:id" exact={true} component={CourseInfo}/>
                    <Route path="/teacher/course/:id/courseware" component={CourseItemList}/>
                    <Route path="/teacher/course/:id/video" component={CourseItemList}/>
                    <Route path="/teacher/course/:id/question" component={CourseItemList}/>
                </div>
            </div>
        </div>
    }

    // render() {
    //     let renderHeader = (props: RouteComponentProps<any>) => {
    //         let cid = props.match.params.id;
    //         return <div>
    //             <a href={`/teacher/course/${cid}`}>课程信息</a>
    //             <a href={`/teacher/course/${cid}/courseware`}>课件列表</a>
    //             <a href={`/teacher/course/${cid}/video`}>视频列表</a>
    //             <a href={`/teacher/course/${cid}/question`}>题目列表</a>
    //         </div>;
    //     };
    //     return <div>
    //         <Route path="/teacher/course" exact={true} component={CourseList}/>
    //         <Route path="/teacher/course/:id" render={renderHeader}/>
    //         <Route path="/teacher/course/:id" exact={true} component={CourseInfo}/>
    //         <Route path="/teacher/course/:id/courseware" component={CourseItemList}/>
    //         <Route path="/teacher/course/:id/video" component={CourseItemList}/>
    //         <Route path="/teacher/course/:id/question" component={CourseItemList}/>
    //     </div>
    // }
}

