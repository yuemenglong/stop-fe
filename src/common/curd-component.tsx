import * as React from "react"
import {EH, RenderComponent, TEH} from "./render-component";
import * as _ from "lodash";
import {max} from "moment";
import {update} from "./updater";
import {ajax, ajaxDelete, ajaxGet, ajaxPost, ajaxPut} from "./kit";
import {Table} from "./Table";
import {Link} from "react-router-dom";
import {RenderPairComponent} from "../component/RenderPair/index";

export interface CurdProps<T> {
    list: Array<T>,
    onChange?: (list: Array<T>) => void,
}

export interface CurdModalProps<T> {
    item: T,
    baseUrl: string,
    onChange: TEH<T>,
}

export class CurdModalState<T> {
    item: T = null;
}

export abstract class CurdModal<T,
    P extends CurdModalProps<T> = CurdModalProps<T>,
    S extends CurdModalState<T> = CurdModalState<T>> extends RenderPairComponent<P, S> {

    abstract getId(): any

    abstract createItem(): T

    componentDidMount() {
        if (!this.getId()) {
            this.setState({item: this.createItem()})
        } else {
            let url = this.props.baseUrl + "/" + this.getId();
            ajaxGet(url, (res) => {
                this.setState({item: res});
            })
        }
    }

    abstract renderContent(submit: TEH<T>): any

    render() {
        if (!this.state.item) {
            return <div/>;
        }
        let submit = () => {
            if (!this.getId()) {
                let url = this.props.baseUrl;
                ajaxPost(url, this.state.item, (res) => {
                    this.props.onChange(res);
                    location.href = url;
                })
            } else {
                let url = this.props.baseUrl + "/" + this.getId();
                ajaxPut(url, this.state.item, (res) => {
                    this.props.onChange(res);
                    location.href = url;
                })
            }
        };
        return this.renderContent(submit);
    }
}

export abstract class CurdComponent<T, P extends CurdProps<T> = CurdProps<T>, S={}>
    extends RenderPairComponent<P, S> {

    static defaultProps = {
        onChange: () => {
        }
    };

    abstract getIdField(): string

    $getId(item: T): any {
        return item[this.getIdField()];
    }

    abstract getBaseUrl(): string

    abstract getHeaderRender(onCreate: TEH<T>, onUpdate: TEH<T>, onDelete: TEH<T>): Array<{ name: string, render: any }>

    abstract renderContent(renderTable: () => any, createLink: EH, updateLink: TEH<T>, deleteLink: TEH<T>): any

    render(): any {
        let onCreate = (item: T) => {
            // let url = this.getBaseUrl();
            // ajaxPost(url, item, (res) => {
            //     let props = update(this.props, "list[]", res);
            //     this.props.onChange(props.list);
            // })

        };
        let onUpdate = (item: T) => {
            // let id = this.$getId(item);
            // let url = this.getBaseUrl() + "/" + id;
            // ajaxPut(url, item, (res) => {
            //     let props = update(this.props, `list[${this.getIdField()}]`, res, [id]);
            //     this.props.onChange(props.list);
            // })
        };
        let onDelete = (item: T) => {
            let id = this.$getId(item);
            let url = this.getBaseUrl() + "/" + id;
            ajaxDelete(url, () => {
                let props = update(this.props, `list[-${this.getIdField()}]`, null, [item[id]]);
                this.props.onChange(props.list);
            });
        };
        let createLink = () => <Link to={`${this.getBaseUrl()}/init`}>添加</Link>;
        let updateLink = (item: T) => <Link to={`${this.getBaseUrl()}/${this.$getId(item)}`}>修改</Link>;
        let deleteLink = (item: T) => {
            return <a href="javascript:void(0)" onClick={onDelete.bind(this.$getId(item))}>删除</a>
        };
        let headers = this.getHeaderRender(onCreate, onUpdate, onDelete);
        let renderTable = () => {
            return <Table list={this.props.list} headers={headers}/>
        };
        return this.renderContent(renderTable, createLink, updateLink, deleteLink)
    }
}
