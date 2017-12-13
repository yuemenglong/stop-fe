import * as React from "react";
import {Component} from "react";
import {Route, RouteComponentProps} from "react-router";
import {ajaxDelete, ajaxGet, ajaxPost} from "../../common/kit";
import {Category} from "../../def/entity";
import {CurdComponent, CurdState} from "../../common/curd-component";
import {EH, TEH} from "../../common/render-component";
import {JVOID0} from "../../def/data";
import {RenderPairComponent} from "../../component/RenderPair/index";
import {Table} from "../../common/Table";
import {update} from "../../common/updater";

class QuestionCategoryListInner extends CurdComponent<Category> {
    constructor(props) {
        super(props);
        this.state = new CurdState<Category>();
    }

    idField(): string {
        return "id";
    }

    urlSlice(): number {
        return 2;
    }

    getHeaderRender(onCreate: EH, onUpdate: TEH<Category>, onDelete: TEH<Category>): Array<{ name: string; render: any }> {
        return [
            {name: "培训方案", render: "name"},
            {
                name: "课程", render: (item: Category) => {
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
        return new Category();
    }

    renderModalContent(onChange: TEH<Category>, onSubmit: EH, onCancel: EH): any {
        let item = this.state.item;
        let headerRender = [
            {name: "名称", render: "name"},
            {
                name: "操作", render: (c: Category) => {
                return <div>
                    <a href={JVOID0} onClick={onDelete.bind(null, c)}>删除</a>
                </div>
            }
            }
        ];
        let onDelete = (c: Category) => {
            ajaxDelete(`/course-category/${c.id}`, () => {
                let item = update(this.state.item, "children[-id]", null, [c.id])
                this.setState({item});
            })
        };
        let table = <Table list={item.children} headers={headerRender} getKey={(c) => c.id}/>;
        let onSave = () => {
            let c = new Category();
            c.name = this.state.data.name;
            c.parentId = this.state.item.id;
            c.level = this.state.item.level + 1;
            ajaxPost(`/course-category`, c, (res) => {
                let item = update(this.state.item, "children[]", res);
                this.setState({item: item, data: {}})
            })
        };
        return <div>
            {this.renderPairInputText("item.name", "名称")}
            {table}
            <div>
                {this.renderPairInputText("data.name", "名称")}
                <button onClick={onSave}>新增子体系</button>
            </div>
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

export class QuestionCategoryList extends Component<RouteComponentProps<any>, State> {
    constructor(props) {
        super(props);
        this.state = new State();
    }

    componentDidMount() {
        ajaxGet("/course-category", (res) => {
            this.setState({list: res})
        })
    }

    render() {
        let onChange = (list) => {
            console.log("OnChange", list);
            this.setState({list})
        };
        console.log("Render", this.state.list);
        return <QuestionCategoryListInner
            list={this.state.list}
            history={this.props.history} onChange={onChange}/>
    }
}

