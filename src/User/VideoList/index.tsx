import * as React from "react";
import {Video, Student, StudentStudyJob, StudentStudyJobItem, StudyJob} from "../../def/entity";
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
import "./style.less";
import {_getUid, _userLeftLocation} from "../../common/common-method";
import "./style.less";

export class VideoList extends ListPageComponent<Video> {
    constructor(props) {
        super(props);
        this.state = new ListPageState<Video>();
    }

    getDataUrl(): string {
        return `/admin/video/list`;
    }

    getCountUrl(): string {
        return `/admin/video/count`;
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
        return <div className={"user-team-video-list-con"}>
            <div>{"当前位置：" + _userLeftLocation(_getUid())}</div>
            <div className='box'>
                <Table className="table table-bordered table-scriped dataTable" list={this.state.list}
                       headers={headers}/>
                {renderPagination()}
            </div>
        </div>;
    }
}

