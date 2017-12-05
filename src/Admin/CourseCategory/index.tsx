import * as React from "react";
import {Component} from "react";
import {Route, RouteComponentProps} from "react-router";
import {ajaxDelete, ajaxGet, ajaxPost} from "../../common/kit";
import {CourseCategory} from "../../def/entity";
import {CurdComponent, CurdState} from "../../common/curd-component";
import {EH, TEH} from "../../common/render-component";
import {JVOID0} from "../../def/data";
import {RenderPairComponent} from "../../component/RenderPair/index";
import {Table} from "../../common/Table";
import {update} from "../../common/updater";

class CourseCategoryListInner extends CurdComponent<CourseCategory> {
    constructor(props) {
        super(props);
        this.state = new CurdState<CourseCategory>();
    }

    idField(): string {
        return "id";
    }

    urlSlice(): number {
        return 2;
    }

    getHeaderRender(onCreate: EH, onUpdate: TEH<CourseCategory>, onDelete: TEH<CourseCategory>): Array<{ name: string; render: any }> {
        return [
            {name: "培训方案", render: "name"},
            {
                name: "课程", render: (item: CourseCategory) => {
                return item.children.map(c => {
                    return <a key={c.id}>{c.name}</a>
                })
            }
            },
            {
                name: "操作", render: (item: CourseCategory) => {
                return <div>
                    <a href={JVOID0} onClick={onUpdate.bind(null, item)}>编辑</a>
                    <a href={JVOID0} onClick={onDelete.bind(null, item)}>删除</a>
                </div>
            }
            }
        ]
    }

    renderContent(renderTable: () => any, renderRoute: () => any, onCreate: EH, onUpdate: TEH<CourseCategory>, onDelete: TEH<CourseCategory>): any {
        return <div>
            {renderTable()}
            {renderRoute()}
            <button onClick={onCreate}>新增</button>
        </div>
    }

    itemConstructor(): CourseCategory {
        return new CourseCategory();
    }

    renderModalContent(onChange: TEH<CourseCategory>, onSubmit: EH, onCancel: EH): any {
        let item = this.state.item;
        let headerRender = [
            {name: "名称", render: "name"},
            {
                name: "操作", render: (c: CourseCategory) => {
                return <div>
                    <a href={JVOID0} onClick={onDelete.bind(null, c)}>删除</a>
                </div>
            }
            }
        ];
        let onDelete = (c: CourseCategory) => {
            ajaxDelete(`/course-category/${c.id}`, () => {
                let item = update(this.state.item, "children[-id]", null, [c.id])
                this.setState({item});
            })
        };
        let table = <Table list={item.children} headers={headerRender} getKey={(c) => c.id}/>;
        let onSave = () => {
            let c = new CourseCategory();
            c.name = this.state.params.name;
            c.parentId = this.state.item.id;
            c.level = this.state.item.level + 1;
            ajaxPost(`/course-category`, c, (res) => {
                let item = update(this.state.item, "children[]", res);
                this.setState({item: item, params: {}})
            })
        };
        return <div>
            {this.renderPairInputText("item.name", "名称")}
            {table}
            <div>
                {this.renderPairInputText("params.name", "名称")}
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
    list: Array<CourseCategory> = []
}

export class CourseCategoryList extends Component<RouteComponentProps<any>, State> {
    constructor(props) {
        super(props);
        this.state = new State();
        (global as any)._c = this;
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
        return <CourseCategoryListInner
            list={this.state.list}
            history={this.props.history} onChange={onChange}/>
    }
}

