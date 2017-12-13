import * as React from "react";
import {Component} from "react";
import {Route, RouteComponentProps} from "react-router";
import {Team, TeamApply} from "../../def/entity";
import {JVOID0} from "../../def/data";
import {ajaxDelete, ajaxGet, ajaxPut} from "../../common/kit";
import {Table} from "../../common/Table";
import _ = require("lodash");
import {update} from "../../common/updater";

export class UserTeam extends Component<RouteComponentProps<any>, { team: TeamApply }> {

    constructor() {
        super();
        this.state = {} as any;
    }

    getUid() {
        return this.props.match.params.uid;
    }

    componentDidMount() {
        ajaxGet(`/user/${this.getUid()}/team`, (team) => {
            this.setState({team})
        })
    }

    renderInit() {
        let last = null;
        switch (_.get(this.state.team, "status")) {
            case "fail":
                last = <div>上次申请被拒绝</div>;
                break;
            case "delete":
                last = <div>队伍已经解散</div>;
                break;
        }
        let onInit = () => {
            this.props.history.push(`/user/${this.getUid()}/team/init`)
        };
        let onJoin = () => {
            this.props.history.push(`/user/${this.getUid()}/team/join`)
        };
        return <div>
            <div>{last}</div>
            <a href={JVOID0} onClick={onInit}>创建队伍</a>
            <a href={JVOID0} onClick={onJoin}>加入队伍</a>
        </div>
    }

    renderWaiting() {
        let exit = () => {
            ajaxDelete(`/user/${this.getUid()}/team`, () => {
                this.setState({team: null})
            })
        };
        return <div>
            <div>正在审核</div>
            <a href={JVOID0} onClick={exit}>撤销申请</a>
        </div>

    }

    renderInfo() {
        let headers = [
            {name: "姓名", render: "student.userName"},
            {name: "得分", render: "student.score"},
        ];
        let exit = () => {
            ajaxDelete(`/user/${this.getUid()}/team`, () => {
                this.setState({team: null})
            })
        };
        let list = this.state.team.team.students.filter(s => {
            return ["succ"].indexOf(s.status) >= 0;
        });
        if (this.state.team.team.createrId == this.getUid()) {
            list = this.state.team.team.students.filter(s => {
                return ["succ", "waiting"].indexOf(s.status) >= 0;
            });
            let permit = (apply) => {
                ajaxPut(`/user/${this.getUid()}/team/students/${apply.id}`, {status: "succ"}, () => {
                    let state = update(this.state, "team.team.students[id].status", "succ", [apply.id]);
                    this.setState(state)
                })
            };
            let forbid = (apply) => {
                ajaxPut(`/user/${this.getUid()}/team/students/${apply.id}`, {status: "fail"}, () => {
                    let state = update(this.state, "team.team.students[id].status", "fail", [apply.id]);
                    this.setState(state)
                })
            };
            (headers as any).push({
                name: "操作", render: (apply: TeamApply) => {
                    if (apply.status == "waiting") {
                        return <div>
                            <a href={JVOID0} onClick={permit.bind(null, apply)}>同意</a>
                            <a href={JVOID0} onClick={forbid.bind(null, apply)}>拒绝</a>
                        </div>
                    } else {
                        return <div/>;
                    }
                }
            });
        }
        return <div>
            <h1>{this.state.team.team.name}</h1>
            <Table list={list} className="table" headers={headers}/>
            <button onClick={exit}>退出队伍</button>
        </div>
    };

    render() {
        if (this.state.team === undefined) {
            return <div/>
        }
        if (this.state.team == null) {
            return this.renderInit();
        }
        switch (this.state.team.status) {
            case "waiting":
                return this.renderWaiting();
            case "succ":
                return this.renderInfo();
            case "fail":
            case "delete":
                return this.renderInit();
        }
    }
}

