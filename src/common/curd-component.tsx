import * as React from "react"
import {EH, RenderComponent, TEH} from "./render-component";
import * as _ from "lodash";
import {max} from "moment";
import {update} from "./updater";
import {ajaxDelete, ajaxPost, ajaxPut} from "./kit";
import {Table} from "./Table";

export interface CurdProps<T> {
    list: Array<T>,
    onChange?: (list: Array<T>) => void,
}

export abstract class CurdComponent<T, P extends CurdProps<T> = CurdProps<T>, S={}>
    extends RenderComponent<P, S> {

    static defaultProps = {
        onChange: () => {
        }
    };

    getIdField(): string {
        return "id";
    }

    $getId(item: T): any {
        return item[this.getIdField()];
    }

    abstract getBaseUrl(): string

    abstract getHeaderRender(onCreate: TEH<T>, onUpdate: TEH<T>, onDelete: TEH<T>): Array<{ name: string, render: any }>

    abstract renderContent(renderTable: () => any, onCreate: TEH<T>, onUpdate: TEH<T>, onDelete: TEH<T>): any

    render(): any {
        let onCreate = (item: T) => {
            let id = this.$getId(item);
            let url = this.getBaseUrl();
            ajaxPost(url, item, (res) => {
                let props = update(this.props, "list[]", res);
                this.props.onChange(props.list);
            })
        };
        let onUpdate = (item: T) => {
            let id = this.$getId(item);
            let url = this.getBaseUrl() + "/" + id;
            ajaxPut(url, item, (res) => {
                let props = update(this.props, `list[${this.getIdField()}]`, res, [id]);
                this.props.onChange(props.list);
            })
        };
        let onDelete = (item: T) => {
            let id = this.$getId(item);
            let url = this.getBaseUrl() + "/" + id;
            ajaxDelete(url, () => {
                let props = update(this.props, `list[-${this.getIdField()}]`, null, [item[id]]);
                this.props.onChange(props.list);
            });
        };
        let headers = this.getHeaderRender(onCreate, onUpdate, onDelete);
        let renderTable = () => {
            return <Table list={this.props.list} headers={headers}/>
        };
        return this.renderContent(renderTable, onCreate, onUpdate, onDelete)
    }
}
