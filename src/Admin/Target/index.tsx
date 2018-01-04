import * as React from "react";
import _ = require("lodash");
import {ListPageComponent, ListPageState} from "../../common/list-page-component";
import {CurdComponent, CurdState} from "../../common/curd-component";
import {EH, TEH, validateRegex} from "../../common/render-component";
import {JVOID0} from "../../def/data";
import {WebUploader} from "../../component/WebUploader/index";
import {Target, FileInfo} from "../../def/entity";
import {ajaxGet, Kit} from "../../common/kit";
import {update} from "../../common/updater";

class TargetListInner extends CurdComponent<Target> {
    constructor(props) {
        super(props);
        this.state = new CurdState<Target>();
    }

    getRenderValidator() {
        let re = validateRegex;
        return {
            item: {
                title: re(/.+/, "请输入题目描述")
            }
        }
    }

    getCate0List() {
        return this.props.data.cate0;
    }

    getCate1List() {
        return this.props.data.cate1;
    }

    itemConstructor(): Target {
        return new Target();
    }

    renderModalContent(onChange: TEH<Target>,
                       onSubmit: EH,
                       onCancel: EH): any {
        let onUpload = (file: FileInfo) => {
            let item = _.clone(this.state.item);
            item.file = file;
            onChange(item);
        };
        let accept = {
            extensions: "ppt,pptx",
            mimeTypes: "application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
        };
        let file = <WebUploader onChange={onUpload} accept={accept}/>;
        if (_.get(this.state.item, "file.fileName")) {
            file = <div>{_.get(this.state.item, "file.fileName")}</div>
        }
        return <div>
            {this.renderPairTextArea("item.name", "名称")}
            {this.renderPairTextArea("item.title", "描述")}
            {this.renderPairInputText("item.baseDir", "路径")}
            {this.renderPairInputText("item.answer", "答案")}
            {this.renderPairInputText("item.score", "分数")}
            <div>
                <span>课件</span>
                {file}
            </div>
            {this.renderPairSelect("item.cate0Id", "一级类别", Kit.optionValueList(this.props.data.cate0, "name", "id"))}
            {this.renderPairSelect("item.cate1Id", "二级类别", Kit.optionValueList(this.props.data.cate1.filter(c => c.parentId == this.state.item.cate0Id), "name", "id"))}
            <button onClick={onSubmit}>确定</button>
            <button onClick={onCancel}>取消</button>
        </div>
    }

    idField(): string {
        return "id";
    }

    getHeaderRender(onCreate: EH, onUpdate: TEH<Target>, onDelete: TEH<Target>): Array<{ name: string; render: any }> {
        return [{
            name: "名称", render: "name",
        }, {
            name: "描述", render: "title",
        }, {
            name: "一级类别", render: "cate0.name",
        }, {
            name: "二级类别", render: "cate1.name",
        }, {
            name: "操作", render: (item: Target) => <div>
                <a href={`/target/${item.baseDir}/index.html`} target="_blank">预览</a>
                <a href={JVOID0} onClick={onUpdate.bind(null, item)}>修改</a>
                <a href={JVOID0} onClick={onDelete.bind(null, item)}>删除</a>
            </div>
        }];
    }

    renderContent(renderTable: () => any,
                  renderRoute: () => any,
                  onCreate: EH,
                  onUpdate: TEH<Target>,
                  onDelete: TEH<Target>): any {
        return <div>
            <h1>靶场题目</h1>
            {renderTable()}
            <button onClick={onCreate}>添加</button>
            {renderRoute()}
        </div>
    }

    getRenderRootMode(): { root: any; mode: string } {
        return {root: this.state, mode: "state"};
    }
}

export class TargetList extends ListPageComponent<Target> {
    constructor(props) {
        super(props);
        this.state = new ListPageState<Target>();
    }

    componentDidMount() {
        ajaxGet(`/admin/category?ty=target&level=0`, (res) => {
            let data = update(this.state.data, "cate0", res);
            this.setState({data});
        });
        ajaxGet(`/admin/category?ty=target&level=1`, (res) => {
            let data = update(this.state.data, "cate1", res);
            this.setState({data});
        })
    }

    getDataUrl(): string {
        return "/admin/target/list";
    }

    getCountUrl(): string {
        return "/admin/target/count";
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
            <TargetListInner
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

