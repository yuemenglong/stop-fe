import * as React from "react";
import {ajaxPut} from "../../../common/kit";
import {ListPageComponent, ListPageProps, ListPageState} from "../../../common/list-page-component";
import {Table} from "../../../common/Table";
import {JVOID0} from "../../../def/data";

interface Props extends ListPageProps {
    ty: string,
    courseId: string,
    selected: Array<any>,
    onSelect: (any) => any,
    onCancel: () => any,
}

export class CourseItemSelector extends ListPageComponent<any, Props> {
    constructor(props) {
        super(props);
        this.state = new ListPageState<any>();
    }

    getSelected() {
        return this.props.data.selected;
    }

    getDataUrl(): string {
        return `/admin/${this.props.ty}/list`;
    }

    getCountUrl(): string {
        return `/admin/${this.props.ty}/count`;
    }

    initFilter(): Object {
        return {}
    }

    getPageRange(): number {
        return 4;
    }

    getHeaders() {
        let op = {
            name: "操作", render: (item: any) => {
                let onSelect = () => {
                    let data = {courseId: this.props.courseId};
                    data[`${this.props.ty}Id`] = item.id;
                    ajaxPut(location.href, data, (res) => {
                        res[this.props.ty] = item;
                        this.props.onSelect(res)
                    })
                };
                if (this.props.selected.map(o => o[this.props.ty].id).indexOf(item.id) >= 0) {
                    return <div>
                        <span>已选择</span>
                    </div>
                } else {
                    return <div>
                        <a href={JVOID0} onClick={onSelect}>选择</a>
                    </div>
                }
            }
        };
        if (this.props.ty == "question") {
            return [
                {name: "名称", render: "title"},
                op,
            ];
        } else {
            return [
                {name: "名称", render: "name"},
                op,
            ];
        }
    }

    renderPage(renderPagination: () => any, refresh: (e?: any) => void, swtch: (page: number) => void): any {
        let headers = this.getHeaders();
        return <div>
            <h1>选择列表</h1>
            <Table className="table" list={this.state.list} headers={headers}/>
            <button onClick={this.props.onCancel}>完成</button>
            {renderPagination()}
        </div>;
    }
}

