import * as React from "react";
import {Component} from "react";
import {Route, RouteComponentProps} from "react-router";
import {Link} from "react-router-dom";
import {ListPageComponent, ListPageState} from "../../../common/list-page-component";
import {QuizJob} from "../../../def/entity";
import {JVOID0} from "../../../def/data";
import {Table} from "../../../common/Table";


export class QuizJobList extends ListPageComponent<QuizJob> {
    constructor(props) {
        super(props);
        this.state = new ListPageState<QuizJob>();
    }

    getUid() {
        return this.props.match.params.uid;
    }

    getDataUrl(): string {
        return `/user/${this.getUid()}/quiz-job/list`
    }

    getCountUrl(): string {
        return `/user/${this.getUid()}/quiz-job/count`
    }

    initFilter(): Object {
        return {};
    }

    getPageRange(): number {
        return 4;
    }

    renderPage(renderPagination: () => any, refresh: (e?: any) => void, swtch: (page: number) => void): any {
        let headers = [{
            name: "名称", render: "quiz.name",
        }, {
            name: "状态", render: (item) => {
                return {waiting: "未完成", succ: "已完成"}[item.status]
            }
        }, {
            name: "操作", render: (item) => {
                return <div>
                    <Link to={`/user/${this.getUid()}/quiz-job/${item.id}`}>进入</Link>
                </div>
            }
        }];
        return <div>
            <Table className="table" list={this.state.list} headers={headers}/>
        </div>
    }
}

