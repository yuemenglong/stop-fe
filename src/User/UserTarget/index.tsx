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
import {_getUid, _userLeftLocation} from "../../common/common-method";
import "./style.less";

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
        return null;
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
            </div>
        }];
    }

    renderContent(renderTable: () => any,
                  renderRoute: () => any,
                  onCreate: EH,
                  onUpdate: TEH<Target>,
                  onDelete: TEH<Target>): any {
        return <div className='user-target-main-con'>
            <div>{"当前位置：" + _userLeftLocation(_getUid())}</div>
            <div className='box'>
                {renderTable()}
                {renderRoute()}
            </div>
        </div>
    }

    getRenderRootMode(): { root: any; mode: string } {
        return {root: this.state, mode: "state"};
    }
}

export class UserTargetList extends ListPageComponent<Target> {
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
        return <div className='user-target-content'>
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

