import * as React from "react";
import {Courseware, Student, StudentStudyJob, StudentStudyJobItem, StudyJob} from "../../def/entity";
import {Component} from "react";
import {RouteComponentProps} from "react-router";
import {ajaxGet, ajaxPut} from "../../common/kit";
import {Def} from "../../def/data";
import {Table} from "../../common/Table";
import {Link} from "react-router-dom";
import {RenderPairComponent} from "../../component/RenderPair/index";
import {WebUploader} from "../../component/WebUploader/index";
import {update} from "../../common/updater";
import {ListPageComponent, ListPageState} from "../../common/list-page-component";

export class CoursewareList extends ListPageComponent<Courseware> {
    constructor(props) {
        super(props);
        this.state = new ListPageState<Courseware>();
    }

    getDataUrl(): string {
        return `/admin/courseware/list`;
    }

    getCountUrl(): string {
        return `/admin/courseware/count`;
    }

    initFilter(): Object {
        return {};
    }

    getPageRange(): number {
        return 4;
    }

    renderPage(renderPagination: () => any, refresh: (e?: any) => void, swtch: (page: number) => void): any {
        let headers = [{
            name: "名称", render: "name"
        }];
        return <div>
            <Table className="table" list={this.state.list} headers={headers}/>
            {renderPagination()}
        </div>;
    }
}

