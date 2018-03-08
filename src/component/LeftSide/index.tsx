import {Component} from "react";
import * as React from "react";
import * as _ from "lodash";
import './style.less';

interface Props {
    cons: Array<{ name: string, url?: string, iconClass?: string, values?: Array<{ name: string, url: string }> }>
}

export class LeftSideClass extends Component<Props, null> {
    render() {
        let cons = this.props.cons;
        if (!_.get(cons, 'length')) return <div/>;
        let pathname = window.location.pathname;
        return <div className={'left-side-con'}>
            <ul className={'sidebar-menu tree'} data-widget="tree">{
                cons.map((item: { name: string, url?: string, iconClass?: string, values?: Array<{ name: string, url: string }> }, idx: number) => {
                    let url = _.get(item, 'url', '#');
                    let iconClass = _.get(item, 'iconClass', '');
                    if (!_.get(item, 'values.length')) {
                        let liaClass = pathname == url ? 'active' : '';
                        return <li key={idx}>
                            <a href={url} className={liaClass}><i className={iconClass}/><span>{item.name}</span></a>
                        </li>
                    } else {
                        let hasUrl = _.some(item.values, ['url', pathname]);
                        let liClass = hasUrl ? 'active menu-open' : '';
                        return <li className={"treeview " + liClass} key={idx}>
                            <a href="#"><i className={iconClass}/><span>{item.name}</span>
                                <span className="pull-right-container">
                                    <i className="fa fa-angle-left pull-right"/></span>
                            </a>
                            <ul className="treeview-menu">{
                                item.values.map((v: { name: string, url: string }, i: number) => {
                                    let aClass = pathname == v.url ? 'active' : '';
                                    return <li key={i}>
                                        <a href={v.url} className={aClass}><i className="fa fa-circle-o"/>{v.name}</a>
                                    </li>
                                })
                            }</ul>
                        </li>
                    }
                })
            }</ul>
        </div>
    }
}