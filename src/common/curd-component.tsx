import * as React from "react"
import {EH, RenderComponent, TEH} from "./render-component";
import * as _ from "lodash";
import {max} from "moment";
import {update} from "./updater";
import {ajax, ajaxDelete, ajaxGet, ajaxPost, ajaxPut} from "./kit";
import {Table} from "./Table";
import {Link} from "react-router-dom";
import {RenderPairComponent} from "../component/RenderPair/index";
import {hostname} from "os";
import {Route} from "react-router";
import {Modal} from "./modal";

export interface CurdProps<T> {
    list: Array<T>,
    onChange: (list: Array<T>) => void,
    history: any,
    match?: any,
    data?: any,
}

export class CurdState<T> {
    item: T = null;
    data: any = {};
}

export abstract class CurdComponent<T, //
    P extends CurdProps<T> = CurdProps<T>, //
    S extends CurdState<T>=CurdState<T>> //
    extends RenderPairComponent<P, S> {

    static defaultProps = {};

    abstract idField(): string

    abstract urlSlice(): number

    $getBaseUrl(): string {
        return location.pathname.split("/").slice(0, this.urlSlice()).join("/")
    }

    $getId(item: T): any {
        return item[this.idField()];
    }

    abstract getHeaderRender(onCreate: EH, //
                             onUpdate: TEH<T>, //
                             onDelete: TEH<T>, //
    ): Array<{ name: string, render: any }>

    abstract renderContent(renderTable: () => any, //
                           renderRoute: () => any, //
                           onCreate: EH, //
                           onUpdate: TEH<T>, //
                           onDelete: TEH<T>, //
    ): any

    abstract itemConstructor(): T

    abstract renderModalContent(onChange: TEH<T>, onSubmit: EH, onCancel: EH): any

    render(): any {
        let onCreate = () => {
            this.setState({item: this.itemConstructor()});
            (this.props.history as any).push(`${this.$getBaseUrl()}/init`)
        };
        let onUpdate = (item: T) => {
            this.setState({item});
            (this.props.history as any).push(`${this.$getBaseUrl()}/${this.$getId(item)}`)
        };
        let onDelete = (item: T) => {
            let id = this.$getId(item);
            let url = this.$getBaseUrl() + "/" + id;
            ajaxDelete(url, () => {
                let props = update(this.props, `list[-${this.idField()}]`, null, [id]);
                this.props.onChange(props.list);
            });
        };
        let headers = this.getHeaderRender(onCreate, onUpdate, onDelete);
        let renderTable = () => {
            return <Table className="table" list={this.props.list}
                          headers={headers} getKey={this.$getId.bind(this)}/>
        };
        let renderModal = (props) => {
            if (!this.state.item) {
                return <div/>;
            }
            let onChange = (item: T) => {
                this.setState({item})
            };
            let onSubmit = () => {
                let item = this.state.item;
                let id = this.$getId(item);
                if (id) {
                    //update
                    let url = `${this.$getBaseUrl()}/${id}`;
                    ajaxPut(url, item, (res) => {
                        let props = update(this.props, "list[id]", res, [id]);
                        this.props.onChange(props.list);
                        this.setState({item: null});
                        props.history.replace(this.$getBaseUrl());
                    });
                } else {
                    //create
                    let url = this.$getBaseUrl();
                    ajaxPost(url, item, (res) => {
                        let props = update(this.props, "list[]", res);
                        this.props.onChange(props.list);
                        this.setState({item: null});
                        props.history.replace(this.$getBaseUrl());
                    })
                }
            };
            let onCancel = () => {
                this.setState({item: null});
                props.history.replace(this.$getBaseUrl());
            };
            let content = this.renderModalContent(onChange, onSubmit, onCancel);
            if (content) {
                return <Modal>{content}</Modal>
            } else {
                return <div/>
            }
        };
        let renderRoute = () => {
            return <Route path={`${this.$getBaseUrl()}/:id`} render={renderModal}/>
        };
        return this.renderContent(//
            renderTable, //
            renderRoute, //
            onCreate, //
            onUpdate, //
            onDelete)
    }
}
