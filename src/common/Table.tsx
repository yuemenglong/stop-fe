import * as React from "react"
import * as _ from "lodash";
import {Component} from "react";

export interface TableProps<T> {
    list: Array<T>,
    headerMap: any, // {"name":"姓名"}
    extHeaderList?: Array<{ name: string, render: (item: T, idx?: number) => any }>, //{name:"操作", render: ()=><div/>}
    props?: any,
}

export class Table<T, P extends TableProps<T> = TableProps<T>, S={}>
    extends Component<P, S> {

    static defaultProps = {
        extHeaderList: [],
        props: {},
    };

    headers() {
        return _.values(this.props.headerMap)
            .concat(this.props.extHeaderList.map(o => o.name))
    }

    renderItem(item: any, idx: number) {
        let tds = _.keys(this.props.headerMap).map(n => {
            return <td key={n}>{item[n]}</td>;
        });
        let ext = this.props.extHeaderList.map(e => {
            return <td key={e.name}>{e.render(item, idx)}</td>
        });
        return <tr key={idx}>
            {tds.concat(ext)}
        </tr>
    }

    renderHeader() {
        return <tr>
            {this.headers().map(h => {
                return <th key={h}>{h}</th>
            })}
        </tr>
    }

    render() {
        return <table {...this.props.props}>
            <thead>
            {this.renderHeader()}
            </thead>
            <tbody>
            {this.props.list.map(this.renderItem.bind(this))}
            </tbody>
        </table>
    }
}
