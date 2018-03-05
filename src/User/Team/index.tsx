import * as React from "react";
import {Component} from "react";
import {Route, RouteComponentProps} from "react-router";
import {Team, TeamApply} from "../../def/entity";
import {JVOID0} from "../../def/data";
import {ajaxDelete, ajaxGet, ajaxPut} from "../../common/kit";
import {Table} from "../../common/Table";
import _ = require("lodash");
import {update} from "../../common/updater";
import {_getUid, _userLeftLocation} from "../../common/common-method";
import "./style.less";

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
        return <div className='user-team-init'>
            <img src='/deploy/imgs/user/team.png' className='team-null-img'/>
            <div className='init-tip'>暂未参加队伍</div>
            <div>{last}</div>
            <a href={JVOID0} onClick={onInit} className='btn bg-orange'>创建队伍</a>
            <a href={JVOID0} onClick={onJoin} className='btn btn-primary'>加入队伍</a>
        </div>
    }

    renderWaiting() {
        let exit = () => {
            ajaxDelete(`/user/${this.getUid()}/team`, () => {
                this.setState({team: null})
            })
        };
        return <div className='user-team-waiting'>
            <img src='/deploy/imgs/user/team.png' className='team-null-img'/>
            <div className='init-tip'>正在申请加入队伍</div>
            <a href={JVOID0} onClick={exit} className='btn bg-orange'>撤销申请</a>
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
                        return <div className={'info-btns-oprate'}>
                            <a href={JVOID0} onClick={permit.bind(null, apply)}>同意</a>
                            <a href={JVOID0} onClick={forbid.bind(null, apply)}>拒绝</a>
                        </div>
                    } else {
                        return <div/>;
                    }
                }
            });
        }
        return <div className='user-team-info'>
            <div className='user-team-info-header'>
                <h3>{this.state.team.team.name}</h3>
                <button onClick={exit} className='btn bg-orange'>退出队伍</button>
            </div>
            <Table list={list} className="table table-bordered table-striped dataTable" headers={headers}/>
        </div>
    };

    renderTeamCon() {
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

    render() {
        console.log('props', this.props)
        console.log('state', this.state)
        if (this.state.team === undefined) {
            return <div/>
        }
        return <div className='user-team-content'>
            <div>{"当前位置：" + _userLeftLocation(_getUid())}</div>
            <div className='box'>{this.renderTeamCon()}</div>
        </div>
    }
}

