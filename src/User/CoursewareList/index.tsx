import * as React from "react";
import {Courseware} from "../../def/entity";
import {Table} from "../../common/Table";
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

