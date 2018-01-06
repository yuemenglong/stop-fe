import {Component} from "react";
import * as React from "react";
import './style.less';
import {JVOID0} from "../../def/data";
import {ajaxGet} from "../../common/kit";

export class HeadMenu extends Component<null, null> {
    logout() {
        ajaxGet(`/admin/logout`, () => {
            location.href = `/login`
        })
    }

    render() {
        return <header className="main-header">
            <a href="javascript:void(0)" className="logo">攻防平台</a>
            <nav className="navbar navbar-static-top">
                <a href="#" className="sidebar-toggle" data-toggle="push-menu" role="button"/>
                <div className="navbar-custom-menu">
                    <ul className="nav navbar-nav">
                        <li className="dropdown user user-menu">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                                <img src="/deploy/imgs/user.jpg" className="user-image" alt="User Image"/>
                                <span className="hidden-xs">XXX</span>
                            </a>
                            <ul className="dropdown-menu">
                                <li className="user-header">
                                    <img src="/deploy/imgs/user.jpg" className="img-circle" alt="User Image"/>
                                    <p>XXX,欢迎来到攻防平台!</p>
                                </li>
                                <li className="user-footer">
                                    <div className="pull-right">
                                        <a href={JVOID0} onClick={this.logout.bind(this)}
                                           className="btn btn-default btn-flat">注销</a>
                                    </div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    }
}