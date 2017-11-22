import * as React from "react"
import {EH, RenderComponent, TEH} from "./render-component";
import * as _ from "lodash";

export interface NavProps<T, H = string> {
    active: number,
    list: Array<T>,
    headers: Array<H>,
    onChange?: (list: Array<T>) => void
    onChangeHeaders?: (headers: Array<H>) => void
    onChangeActive: (active: number) => void
}

export abstract class NavComponent<T, H = string, P extends NavProps<T, H> = NavProps<T, H>, S={}>
    extends RenderComponent<P, S> {

    static defaultProps = {list: [], headers: []} as any;

    abstract itemKey(item: T): string

    abstract itemConstructor(): T

    // noinspection JSMethodCanBeStatic
    headerConstructor(): H {
        return null
    }

    abstract renderHeader(header: H, idx: number, key: string, isActive: boolean, onClick: EH, onDelete: EH): any

    abstract renderContent(item: T, idx: number, renderHeader: (h: H, idx: number) => void,
                           onChangeActive: TEH<number>, onCreate: EH, onDelete: TEH<number>): any

    $onCreate() {
        let item = this.itemConstructor();
        if (item) {
            _.isObject(item) && ((item as any)._key = Math.random());
            this.props.onChange(this.props.list.concat([item]));
            this.props.onChangeHeaders && this.props.onChangeHeaders(this.props.headers.concat([this.headerConstructor()]));
            this.props.onChangeActive(this.props.list.length)
        }
    }

    $onDelete(idx: number) {
        if (idx == this.props.active) {
            //删除的为active的情况
            let active = _.round(this.props.active) - 1;
            if (idx >= 0) {
                this.props.onChangeActive(active)
            } else {
                this.props.onChangeActive(0)
            }
        }
        let list = this.props.list.slice(0, idx).concat(this.props.list.slice(idx + 1));
        let headers = this.props.headers.slice(0, idx).concat(this.props.headers.slice(idx + 1));
        this.props.onChange(list);
        this.props.onChangeHeaders && this.props.onChangeHeaders(headers);
    }

    $onChangeActive(idx: number) {
        this.props.onChangeActive(idx)
    }

    $getKey(item: T): string {
        if (item == null) {
            return null
        }
        let key = this.itemKey(item);
        if (key != null) {
            return key;
        }
        key = (item as any)._key;
        if (key) {
            return key;
        } else {
            throw Error("No Key In List Item")
        }
    }

    $renderHeader(header: H, idx: number) {
        let key = this.$getKey(this.props.list[idx]);
        return this.renderHeader(header, idx, key,
            this.props.active == idx,
            this.$onChangeActive.bind(this, idx),
            this.$onDelete.bind(this, idx),
        )
    }

    render(): any {
        if (this.props.headers.length != this.props.list.length) {
            throw Error("Header Length And List Length Not Match")
        }
        let active = this.props.list[_.round(this.props.active)];
        return this.renderContent(active, this.props.active,
            this.$renderHeader.bind(this), this.$onChangeActive.bind(this),
            this.$onCreate.bind(this), this.$onDelete.bind(this))
    }
}
