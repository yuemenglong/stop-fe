import * as React from "react"
import {EH, RenderComponent, TEH} from "./render-component";
import * as _ from "lodash";
import {max} from "moment";

export interface SelectorProps<T> {
    list: Array<T>,
    selected: Array<T>,
    maxSelect: number,
    onChange: (selected: Array<T>) => void,
}

export abstract class SelectorComponent<T, P extends SelectorProps<T> = SelectorProps<T>, S={}>
    extends RenderComponent<P, S> {

    abstract itemKey(item: T): string

    abstract renderItem(item: T, idx: number, key: string, checked: boolean, onChange: EH): any

    $selectedIdx(item: T): number {
        return _.findIndex(this.props.selected, (o) => {
            return this.itemKey(o) == this.itemKey(item)
        });
    }

    $onChange(item: T, e: any) {
        let selectedIdx = this.$selectedIdx(item);

        if(this.props.maxSelect == 1){
            let selected = [item];
            this.props.onChange(selected);
        }
        // 不在已选择中并且被选中并且还能选
        if (e.target.checked && selectedIdx < 0 && this.props.selected.length < this.props.maxSelect) {
            let selected = this.props.selected.concat([item]);
            this.props.onChange(selected);
        }
        // 在已选择中并且被反选
        if (!e.target.checked && selectedIdx >= 0) {
            let selected = this.props.selected.filter(o => {
                return this.itemKey(o) != this.itemKey(item)
            });
            this.props.onChange(selected);
        }
    }

    $onChangeAll() {
        if (this.props.selected.length != this.props.list.length) {
            this.props.onChange(this.props.list)
        } else {
            this.props.onChange([])
        }
    }

    $renderItem(item: T, idx: number) {
        let key = this.itemKey(item);
        let checked = this.$selectedIdx(item) >= 0;
        return this.renderItem(item, idx, key, checked, this.$onChange.bind(this, item))
    }

    abstract renderContent(renderItem: (item: T, idx: number) => any, checkedAll: boolean, onChangeAll: () => void): any

    render(): any {
        let checkedAll = this.props.list.length == this.props.selected.length;
        return this.renderContent(
            this.$renderItem.bind(this),
            checkedAll,
            this.$onChangeAll.bind(this)
        )
    }
}
