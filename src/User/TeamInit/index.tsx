import * as React from "react";
import {Component} from "react";
import {Route, RouteComponentProps} from "react-router";
import {Team} from "../../def/entity";
import {JVOID0} from "../../def/data";
import {RenderPairComponent} from "../../component/RenderPair/index";
import {ajaxPost} from "../../common/kit";

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
        return <div>
            {this.renderPairInputText("team.name", "队伍名称")}
            <button onClick={submit}>确定</button>
            <button onClick={cancel}>取消</button>
        </div>
    }
}

