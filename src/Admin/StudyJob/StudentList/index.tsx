import * as React from "react";
import {Component} from "react";
import {ListPageComponent, ListPageState} from "../../../common/list-page-component";
import {StudyJob} from "../../../def/entity";
import {ajaxGet} from "../../../common/kit";
import {RouteComponentProps} from "react-router";

export class StudyJobStudentList extends Component<RouteComponentProps<any>, { job: StudyJob }> {
    constructor(props) {
        super(props);
    }

    getId() {
        return this.props.match.params.id;
    }

    componentDidMount() {
        ajaxGet(`/study-job/${this.getId()}`, (res) => {
            this.setState({job: res})
        })
    }

    render() {
        return <div>
            <h1>Detail</h1>
        </div>
    }

}

