import * as React from "react";
import {Table} from "../../common/Table";
import {ajax} from "../../common/kit";
import {Course, Courseware, Question, Video} from "../../def/entity";
import {Modal} from "../../common/modal";
import {RenderPairComponent} from "../../component/RenderPair/index";
import * as _ from "lodash";
import {RouteComponentProps} from "react-router";
import {Link} from "react-router-dom";
import {questionTypeMap} from "../../def/data";

class State {
    course: Course = new Course();
    question: Question = null;
}


export class QuestionList extends RenderPairComponent<RouteComponentProps<any>, State> {
    getRenderRootMode(): { root: any; mode: string } {
        return {root: this.state, mode: "state"};
    }

    getCid() {
        return this.props.match.params.id;
    }

    constructor() {
        super();
        this.state = new State();
    }

    componentDidMount() {
        ajax({
            url: "/course/" + this.getCid(),
            type: "GET",
            success: (res) => {
                this.setState({course: res})
            }
        })
    }

    renderModal() {
        if (!this.state.question) {
            return;
        }
        let submit = () => {
            ajax({
                url: `/course/${this.getCid()}/question`,
                type: "POST",
                data: JSON.stringify(this.state.question),
                success: (res) => {
                    let course = _.cloneDeep(this.state.course);
                    course.questions.push(res);
                    course.questionCount = course.questions.length;
                    this.setState({course, question: null});
                }
            })
        };
        return <Modal>
            {this.renderPairInputText("question.name", "名字")}
            <button onClick={submit}>确定</button>
        </Modal>
    }

    render() {
        let onDelete = (item: Video) => {
            ajax({
                url: `/course/${this.getCid()}/question/${item.id}`,
                type: "DELETE",
                success: () => {
                    // noinspection SillyAssignmentJS
                    location.href = location.href;
                }
            })
        };
        let headers = [{
            name: "题目", render: "title",
        }, {
            name: "类型", render: (item) => questionTypeMap[item.ty],
        }, {
            name: "分值", render: "score",
        }, {
            name: "操作", render: (item: Question) => <div>
                <Link to={`/course/${this.getCid()}/question/${item.id}`}>查看</Link>
                <a href="javascript:void(0)" onClick={onDelete.bind(this, item)}>删除</a>
            </div>
        }];
        return <div>
            <h1>题目</h1>
            <Table list={this.state.course.questions}
                   headers={headers}
                   props={{className: "table"}}/>
            <Link to={`/course/${this.getCid()}/question/init`} className="btn btn-primary">新增</Link>
            {this.renderModal()}
        </div>
    }
}

