import * as React from "react";
import {Component} from "react";
import {CurdComponent, CurdState} from "../../common/curd-component";
import {Category} from "../../def/entity";
import {EH, TEH} from "../../common/render-component";
import {JVOID0} from "../../def/data";
import {ajaxDelete, ajaxGet, ajaxPost} from "../../common/kit";
import {Table} from "../../common/Table";
import {update} from "../../common/updater";

class CategoryInner extends CurdComponent<Category> {
    constructor(props) {
        super(props);
        this.state = new CurdState<Category>();
    }

    getTy() {
        return this.props.data.ty;
    }

    idField(): string {
        return "id";
    }

    urlSlice(): number {
        return 3;
    }

    getHeaderRender(onCreate: EH, onUpdate: TEH<Category>, onDelete: TEH<Category>): Array<{ name: string; render: any }> {
        return [
            {name: "一级体系", render: "name"},
            {
                name: "名称", render: (item: Category) => {
                return item.children.map(c => {
                    return <a key={c.id}>{c.name}</a>
                })
            }
            },
            {
                name: "操作", render: (item: Category) => {
                return <div>
                    <a href={JVOID0} onClick={onUpdate.bind(null, item)}>编辑</a>
                    <a href={JVOID0} onClick={onDelete.bind(null, item)}>删除</a>
                </div>
            }
            }
        ]
    }

    renderContent(renderTable: () => any, renderRoute: () => any, onCreate: EH, onUpdate: TEH<Category>, onDelete: TEH<Category>): any {
        return <div>
            {renderTable()}
            {renderRoute()}
            <button onClick={onCreate}>新增</button>
        </div>
    }

    itemConstructor(): Category {
        let ret = new Category();
        ret.ty = this.getTy();
        return ret;
    }

    renderModalContent(onChange: TEH<Category>, onSubmit: EH, onCancel: EH): any {
        let item = this.state.item;
        let headerRender = [
            {name: "二级体系名称", render: "name"},
            {
                name: "操作", render: (c: Category) => {
                return <div>
                    <a href={JVOID0} onClick={onDelete.bind(null, c)}>删除</a>
                </div>
            }
            }
        ];
        let onDelete = (c: Category) => {
            ajaxDelete(`${location.pathname}/${c.id}`, () => {
                let item = update(this.state.item, "children[-id]", null, [c.id])
                this.setState({item});
                let props = update(this.props, "list[id].children", item.children, [item.id]);
                this.props.onChange(props.list)
            })
        };
        let table = <Table className="table" list={item.children} headers={headerRender} getKey={(c) => c.id}/>;
        let onSaveSub = () => {
            let c = new Category();
            c.ty = this.getTy();
            c.name = this.state.data.name;
            c.parentId = this.state.item.id;
            c.level = this.state.item.level + 1;
            ajaxPost(`${location.pathname}`, c, (res) => {
                let item = update(this.state.item, "children[]", res);
                this.setState({item: item, data: {}});
                let props = update(this.props, "list[id].children", item.children, [item.id]);
                this.props.onChange(props.list)
            })
        };
        let subs = this.state.item.id ? <div>
            {table}
            {this.renderPairInputText("data.name", "二级体系名称")}
            <button onClick={onSaveSub}>新增二级体系</button>
        </div> : <div/>;
        return <div>
            {this.renderPairInputText("item.name", "名称")}
            {subs}
            <button onClick={onSubmit}>保存</button>
            <button onClick={onCancel}>取消</button>
        </div>
    }

    getRenderRootMode(): { root: any; mode: string; onChange?: Function } {
        return {root: this.state, mode: "state"}
    }

}

class State {
    list: Array<Category> = []
}

class Props {
    ty: string;
    match?: any;
    history?: any;
}

export class CategoryList extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = new State();
    }

    componentDidMount() {
        ajaxGet(`${location.pathname}?ty=${this.props.ty}`, (res) => {
            this.setState({list: res})
        })
    }

    render() {
        let onChange = (list) => {
            this.setState({list})
        };
        return <CategoryInner
            list={this.state.list}
            history={this.props.history} onChange={onChange}
            data={{ty: this.props.ty}}
        />
    }
}

