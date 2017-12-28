import * as React from "react";
import {StudentStudyJob, StudentStudyJobItem, StudyJob} from "../../def/entity";
import {Component} from "react";
import {RouteComponentProps} from "react-router";
import {ajaxGet} from "../../common/kit";
import {Def} from "../../def/data";
import {Table} from "../../common/Table";
import {Link} from "react-router-dom";
import {RenderPairComponent} from "../../component/RenderPair/index";


export class UserHome extends RenderPairComponent<RouteComponentProps<any>> {
    getRenderRootMode(): { root: any; mode: string; onChange?: Function } {
        return {root: this.state, mode: "state"}
    }

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        ajaxGet(location.pathname, (user) => {
            this.setState({user})
        })
    }

    render() {
        return <div>
            {this.renderPairInputText("user.name", "姓名")}
            {this.renderPairInputText("user.clazz.name", "班级")}
        </div>
    }
}

