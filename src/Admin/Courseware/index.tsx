import * as React from "react";
import _ = require("lodash");
import {ListPageComponent, ListPageState} from "../../common/list-page-component";
import {CurdComponent, CurdState} from "../../common/curd-component";
import {EH, TEH} from "../../common/render-component";
import {JVOID0} from "../../def/data";
import {FileInfo, WebUploader} from "../../component/WebUploader/index";
import {Courseware} from "../../def/entity";
import {ajaxGet, Kit} from "../../common/kit";
import {update} from "../../common/updater";

class CoursewareListInner extends CurdComponent<Courseware> {
    constructor(props) {
        super(props);
        this.state = new CurdState<Courseware>();
    }

    itemConstructor(): Courseware {
        return new Courseware();
    }

    renderModalContent(onChange: TEH<Courseware>,
                       onSubmit: EH,
                       onCancel: EH): any {
        let onUpload = (file: FileInfo) => {
            let courseware = _.clone(this.state.item);
            courseware.fileId = file.fileId;
            courseware.fileName = file.fileName;
            courseware.ext = file.ext;
            courseware.size = file.size;
            onChange(courseware);
        };
        let file = <WebUploader onChange={onUpload}/>;
        if (this.state.item.fileName) {
            file = <div>{this.state.item.fileName}</div>
        }
        return <div>
            {this.renderPairInputText("item.name", "名称")}
            {file}
            {this.renderPairSelect("item.cate0Id", "一级类别", Kit.optionValueList(this.props.data.cate0, "name", "id"))}
            {this.renderPairSelect("item.cate1Id", "二级类别", Kit.optionValueList(this.props.data.cate1.filter(c => c.parentId == this.state.item.cate0Id), "name", "id"))}
            <button onClick={onSubmit}>确定</button>
            <button onClick={onCancel}>取消</button>
        </div>
    }

    urlSlice(): number {
        return 5;
    }

    idField(): string {
        return "id";
    }

    getHeaderRender(onCreate: EH, onUpdate: TEH<Courseware>, onDelete: TEH<Courseware>): Array<{ name: string; render: any }> {
        return [{
            name: "名称", render: "name",
        }, {
            name: "类型", render: "ext",
        }, {
            name: "大小", render: "size",
        }, {
            name: "操作", render: (item: Courseware) => <div>
                <a href={`/upload/${item.fileId}`} target="_blank">下载</a>
                <a href={JVOID0} onClick={onUpdate.bind(null, item)}>修改</a>
                <a href={JVOID0} onClick={onDelete.bind(null, item)}>删除</a>
            </div>
        }];
    }

    renderContent(renderTable: () => any,
                  renderRoute: () => any,
                  onCreate: EH,
                  onUpdate: TEH<Courseware>,
                  onDelete: TEH<Courseware>): any {
        return <div>
            <h1>课件</h1>
            {renderTable()}
            <button onClick={onCreate}>添加</button>
            {renderRoute()}
        </div>
    }

    getRenderRootMode(): { root: any; mode: string } {
        return {root: this.state, mode: "state"};
    }
}

export class CoursewareList extends ListPageComponent<Courseware> {
    constructor(props) {
        super(props);
        this.state = new ListPageState<Courseware>();
    }

    componentDidMount() {
        ajaxGet(`/admin/category?ty=courseware&level=0`, (res) => {
            let data = update(this.state.data, "cate0", res);
            console.log(data);
            this.setState({data});
        });
        ajaxGet(`/admin/category?ty=courseware&level=1`, (res) => {
            let data = update(this.state.data, "cate1", res);
            console.log(data);
            this.setState({data});
        })
    }

    getDataUrl(): string {
        return "/admin/courseware/list";
    }

    getCountUrl(): string {
        return "/admin/courseware/count";
    }

    initFilter(): Object {
        return {};
    }

    getPageRange(): number {
        return 4;
    }

    renderPage(renderPagination: () => any, refresh: (e?: any) => void, swtch: (page: number) => void): any {
        let onChange = (list) => {
            this.setState({list})
        };
        return <div>
            <CoursewareListInner
                list={this.state.list}
                onChange={onChange}
                history={this.props.history}
                data={this.state.data}/>
            {renderPagination()}
        </div>
    }

    getRenderRootMode(): { root: any; mode: string } {
        return {root: this.state, mode: "state"};
    }
}
