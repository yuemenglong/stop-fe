import * as React from "react"
import * as _ from "lodash";
import {Component} from "react";

export interface TableProps<T> {
    list: Array<T>,
    headers: Array<{ name: string, render: any }>, // {"name":"姓名"}
    getKey?: Function,
    className?: String,
    props?: any,
}

export class Table<T, P extends TableProps<T> = TableProps<T>, S={}>
    extends Component<P, S> {

    static defaultProps = {
        props: {},
    };

    headers() {
        return this.props.headers.map(h => h.name);
    }

    renderItem(item: any, idx: number) {
        let tds = this.props.headers.map(p => {
            let render = (_.isString(p.render) ? () => _.get(item, p.render.toString()) : p.render) as any;
            return <td key={p.name}>{render(item)}</td>;
        });
        let key = this.props.getKey ? this.props.getKey(item, idx) : idx;
        return <tr key={key}>{tds}</tr>
    }

    renderHeader() {
        return <tr>
            {this.headers().map(h => {
                return <th key={h}>{h}</th>
            })}
        </tr>
    }

    render() {
        return <table className={this.props.className} {...this.props.props}>
            <thead>
            {this.renderHeader()}
            </thead>
            <tbody>
            {this.props.list.map(this.renderItem.bind(this))}
            </tbody>
        </table>
    }
}
