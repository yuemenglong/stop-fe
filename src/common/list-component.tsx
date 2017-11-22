import * as React from "react";
import * as _ from "lodash";
import {EH, RenderComponent, TEH} from "./render-component";

export interface ListComponentProps<T> {
    list: Array<T>,
    onChange: (list: T[]) => void
}

export abstract class ListComponent<T, P extends ListComponentProps<T>=ListComponentProps<T>, S={}>
    extends RenderComponent<P, S> {
    getRenderRootMode(): { root: any; mode: string } {
        return {root: this.props.list, mode: "props"};
    }

    $renderItem(item: T, idx: number) {
        let key = this.$getKey(item);
        let onChange = (item: T) => {
            let list = this.props.list.map(obj => {
                let k = this.$getKey(obj);
                if (k == key) {
                    return item;
                } else {
                    return obj;
                }
            });
            this.onChange(list);
        };
        // noinspection JSUnusedLocalSymbols
        let onDelete = (e: any) => {
            let list = this.props.list.filter(item => {
                let k = this.$getKey(item);
                return k != key;
            });
            this.props.onChange(list);
        };
        // noinspection JSUnusedLocalSymbols
        let onUp = (e: any) => {
            let l = this.props.list;
            if (idx == 0) {
                return;
            }
            let list = _.concat(l.slice(0, idx - 1), [item], [l[idx - 1]], l.slice(idx + 1));
            this.props.onChange(list);
        };
        // noinspection JSUnusedLocalSymbols
        let onDown = (e: any) => {
            let l = this.props.list;
            if (idx == l.length - 1) {
                return;
            }
            let list = _.concat(l.slice(0, idx), [l[idx + 1]], [item], l.slice(idx + 2));
            this.props.onChange(list);
        };
        return this.renderItem(item, idx, key,
            onChange, onDelete, {onUp, onDown});
    }

    $getKey(item: T): string {
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

    // noinspection JSMethodCanBeStatic
    onChangeHook(list: T[]): T[] {
        return list;
    }

    onChange(list: T[]) {
        this.props.onChange(this.onChangeHook.call(this, list))
    }

    abstract itemKey(item: T): string

    abstract itemConstructor(): T

    abstract renderList(renderItem: (item: T, idx: number) => any, onCreate: EH): any

    abstract renderItem(item: T, idx: number, key: string,
                        onChange: TEH<T>, onDelete: EH,
                        opt?: { onUp?: EH, onDown?: EH }): any

    render() {
        // noinspection JSUnusedLocalSymbols
        let onCreate = (e: any) => {
            let item = this.itemConstructor();
            if (item) {
                (item as any)._key = Math.random();
                this.props.onChange(this.props.list.concat([item]))
            }
        };
        let renderItem = this.$renderItem.bind(this);
        return this.renderList(renderItem, onCreate)
    }
}

