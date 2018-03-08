import * as React from "react";
import {Component} from "react";
import {Route, RouteComponentProps} from "react-router";
import {Team} from "../../def/entity";
import {JVOID0} from "../../def/data";
import {RenderPairComponent} from "../../component/RenderPair/index";
import {ajaxPost} from "../../common/kit";
import "./style.less";

export class UserTeamInit extends RenderPairComponent<RouteComponentProps<any>, { team: Team }> {
    getUid() {
        return this.props.match.params.uid;
    }

    constructor(props) {
        super(props);
        this.state = {team: {createrId: this.getUid()}} as any;
    }

    getRenderRootMode(): { root: any; mode: string; onChange?: Function } {
        return {root: this.state, mode: "state"}
    }

    render() {
        let submit = () => {
            ajaxPost(`/user/${this.getUid()}/team`, this.state.team, () => {
                this.props.history.push(`/user/${this.getUid()}/team`)
            })
        };
        let cancel = () => {
            this.props.history.push(`/user/${this.getUid()}/team`)
        };
        return <div className={'user-team-init-con'}>
            <div>当前位置：查看队伍 > 创建队伍</div>
            <div className={'box'}>
                {this.renderPairInputText("team.name", "队伍名称")}
                <button onClick={submit} className='btn bg-orange'>确定</button>
                <a href={JVOID0} onClick={cancel}>取消</a>
            </div>
        </div>
    }
}

