import * as React from "react";
import {Component} from "react";
import {Route, RouteComponentProps} from "react-router";
import {Team} from "../../def/entity";
import {JVOID0} from "../../def/data";
import {ajaxGet, ajaxPut} from "../../common/kit";
import {Table} from "../../common/Table";
import "./style.less";

export class UserTeamJoin extends Component<RouteComponentProps<any>, { teams: Array<Team> }> {

    constructor() {
        super();
        this.state = {teams: []} as any;
    }

    getUid() {
        return this.props.match.params.uid;
    }

    componentDidMount() {
        ajaxGet(`/teacher/team/list`, (res) => {
            this.setState({teams: res})
        })
    }

    render() {
        let join = (team: Team) => {
            ajaxPut(`/user/${this.getUid()}/team`, {id: team.id}, () => {
                this.props.history.push(`/user/${this.getUid()}/team`)
            })
        };
        let headers = [
            {name: "队伍名称", render: "name"},
            {name: "创建人", render: "creater.userName"},
            {name: "人数", render: "studentCount"},
            {name: "积分", render: "score"},
            {
                name: "操作", render: (team: Team) => {
                return <div>
                    <a href={JVOID0} onClick={join.bind(null, team)}>申请加入</a>
                </div>
            }
            }
        ];
        let back = () => {
            this.props.history.push(`/user/${this.getUid()}/team`)
        };
        return <div className='user-team-join-con'>
            <div>当前位置:查看队伍 > 加入队伍</div>
            <div className={'box'}>
                <a href={JVOID0} onClick={back} className='back'>返回</a>
                <Table className="table table-bordered table-striped dataTable" headers={headers}
                       list={this.state.teams}/>
            </div>
        </div>;
    }
}