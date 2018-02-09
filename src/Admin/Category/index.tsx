import * as React from "react";
import {Component} from "react";
import {CurdComponent, CurdProps, CurdState} from "../../common/curd-component";
import {Category} from "../../def/entity";
import {EH, TEH} from "../../common/render-component";
import {JVOID0} from "../../def/data";
import {ajaxDelete, ajaxGet, ajaxPost} from "../../common/kit";
import {Table} from "../../common/Table";
import {update, updates} from "../../common/updater";
import {Modal} from "../../common/modal";
import {RenderPairComponent} from "../../component/RenderPair/index";
import './style.less';
import * as _ from "lodash";

class Categor2Inner extends RenderPairComponent<{
    cate: Category,
    onChange: (cate: Category) => any,
    onCancel: () => any
}, { name }> {
    getRenderRootMode(): { root: any; mode: string; onChange?: Function } {
        return {root: this.state, mode: "state"};
    }

    constructor(props) {
        super(props);
        this.state = {name: ""}
    }

    render() {
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
                let cate = update(this.props.cate, "children[-id]", null, [c.id]);
                this.props.onChange(cate)
            });
        };
        let onSaveSub = () => {
            if (!this.state.name) {
                alert("请输入二级体系名称");
                return;
            }
            let c = new Category();
            c.ty = this.props.cate.ty;
            c.name = this.state.name;
            c.parentId = this.props.cate.id;
            c.level = this.props.cate.level + 1;
            ajaxPost(`${location.pathname}`, c, (res) => {
                let cate = update(this.props.cate, "children[]", res);
                this.props.onChange(cate);
                this.setState({name: ""})
            })
        };
        let children=this.props.cate.children;
        let table=!_.get(children,'length')?false:
            <Table className="table  table-bordered table-striped dataTable" list={this.props.cate.children} headers={headerRender} getKey={(c) => c.id}/>;
        return <div className={'modal-content two-cate-modal'}>
            <div className={'modal-header'}>
                <button type={'button'} className={'close'} onClick={this.props.onCancel}>×</button>
                <h4 className={'modal-title'} style={{textAlign: 'left'}}>编辑课程二级体系</h4>
            </div>
            <div className={'modal-body'}>
                {table}
                {this.renderPairInputText("name", "二级体系名称")}
                <button onClick={onSaveSub} className={'btn bg-orange btn-add-two-cate'}>新增二级体系</button>
            </div>
            <div className={'modal-footer'}>
                <button onClick={this.props.onCancel} className={'btn btn-default'}>关闭</button>
            </div>
        </div>
    }
}

class InnerState extends CurdState<Category> {
    cate2: Category = null;
}

class CategoryInner extends CurdComponent<Category, CurdProps<Category>, InnerState> {
    constructor(props) {
        super(props);
        this.state = new InnerState();
    }

    getTy() {
        return this.props.data.ty;
    }

    idField(): string {
        return "id";
    }

    getHeaderRender(onCreate: EH, onUpdate: TEH<Category>, onDelete: TEH<Category>): Array<{ name: string; render: any }> {
        let onCate2 = (cate) => {
            this.setState({cate2: cate})
        };
        return [
            {name: "一级体系", render: "name"},
            {
                name: "二级体系", render: (item: Category) => {
                return item.children.map(c => {
                    return <a key={c.id}>{c.name}</a>
                })
            }
            },
            {
                name: "操作", render: (item: Category) => {
                return <div className={'category-table-btn'}>
                    <a href={JVOID0} onClick={onUpdate.bind(null, item)}>编辑</a>
                    <a href={JVOID0} onClick={onCate2.bind(null, item)}>编辑二级体系</a>
                    <a href={JVOID0} onClick={onDelete.bind(null, item)}>删除</a>
                </div>
            }
            }
        ]
    }

    renderContent(renderTable: () => any, renderModal: () => any, onCreate: EH, onUpdate: TEH<Category>, onDelete: TEH<Category>): any {
        return <div className={'category-con box'}>
            <button type={'button'} className={'btn bg-orange btn-add'} onClick={onCreate}>新增</button>
            {renderTable()}
            {renderModal()}
            {this.renderCate2Modal()}
        </div>
    }

    itemConstructor(): Category {
        let ret = new Category();
        ret.ty = this.getTy();
        return ret;
    }

    renderCate2Modal() {
        if (!this.state.cate2) {
            return;
        }
        let onChange = (cate) => {
            let props = update(this.props, "list[id]", cate, [cate.id]);
            this.props.onChange(props.list);
            this.setState({cate2: cate});
        };
        let onCancel = () => {
            this.setState({cate2: null})
        };
        return <Modal className={'modal-dialog'}>
            <Categor2Inner cate={this.state.cate2} onChange={onChange} onCancel={onCancel}/>
        </Modal>
    }

    renderModalContent(onChange: TEH<Category>, onSubmit: EH, onCancel: EH, modalHeader: (item: string) => void): any {
        return <div className={'modal-content'}>
            {modalHeader('新增课程一级体系')}
            <div className={'modal-body'}>{this.renderPairInputText("item.name", "名称")}</div>
            <div className={'modal-footer'}>
                <button onClick={onCancel} className={'btn btn-default'}>取消</button>
                <button onClick={onSubmit} className={'btn btn-primary'}>保存</button>
            </div>
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

