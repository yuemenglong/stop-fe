import * as React from "react";
import {RouteComponentProps} from "react-router";
import {Component} from "react";
import {CurdComponent, CurdState} from "../../../common/curd-component";
import {ajaxGet} from "../../../common/kit";
import {EH, TEH} from "../../../common/render-component";
import {CourseItemSelector} from "../Selector/index";
import {JVOID0} from "../../../def/data";
import './style.less';


class ListInner extends CurdComponent<any> {
    constructor() {
        super();
        this.state = new CurdState<any>();
    }

    getTy() {
        return this.props.data.ty;
    }

    idField(): string {
        return "id";
    }

    urlSlice(): number {
        return 5;
    }

    getHeaderRender(onCreate: EH, onUpdate: TEH<any>, onDelete: TEH<any>): Array<{ name: string; render: any }> {
        if (this.getTy() == "question") {
            return [
                {name: "名称", render: `[${this.getTy()}].title`},
                {
                    name: "操作", render: (item) => {
                    return <div>
                        <a href={JVOID0} onClick={onDelete.bind(null, item)}>删除</a>
                    </div>
                }
                }
            ];
        } else {
            return [
                {name: "名称", render: `[${this.getTy()}].name`},
                {
                    name: "操作", render: (item) => {
                    return <div>
                        <a href={JVOID0} onClick={onDelete.bind(null, item)}>删除</a>
                    </div>
                }
                }
            ];
        }
    }

    renderContent(renderTable: () => any, renderModal: () => any, onCreate: EH, onUpdate: TEH<any>, onDelete: TEH<any>): any {
        return <div className={'teacher-course-item-list'}>
            <button onClick={onCreate} className={'btn bg-orange btn-add'}>新增</button>
            {renderTable()}
            {renderModal()}
        </div>;
    }

    itemConstructor(): any {
        return {};
    }

    renderModalContent(onChange: TEH<any>, onSubmit: EH, onCancel: EH, modalHeader: (item: string) => void): any {
        let onSelect = (item) => {
            this.props.onChange(this.props.list.concat(item))
        };
        return <CourseItemSelector
            history={this.props.history}
            selected={this.props.list}
            courseId={this.props.match.params.id}
            onSelect={onSelect}
            onCancel={onCancel}
            modalHeader={modalHeader}
            ty={this.getTy()}
        />
    }

    getRenderRootMode(): { root: any; mode: string; onChange?: Function } {
        return {root: this.state, mode: "state"};
    }
}

export class CourseItemList extends Component<RouteComponentProps<any>, { list: Array<any> }> {
    constructor() {
        super();
        this.state = {list: []}
    }

    componentDidMount() {
        ajaxGet(location.pathname, res => {
            this.setState({list: res})
        })
    }

    getTy() {
        return location.pathname.split("/").slice(-1)[0]
    }

    render() {
        let onChange = (list) => {
            this.setState({list})
        };
        return <ListInner onChange={onChange}
                          history={this.props.history}
                          match={this.props.match}
                          list={this.state.list}
                          data={{ty: this.getTy()}}/>
    }
}

