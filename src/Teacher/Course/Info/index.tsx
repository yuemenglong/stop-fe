import * as React from "react";
import {RenderComponent} from "../../../common/render-component";
import {ajax, ajaxGet, ajaxPost, ajaxPut, Kit} from "../../../common/kit";
import {Course, Category} from "../../../def/entity";
import {RouteComponentProps} from "react-router";
import {Def} from "../../../def/data";

class State {
    course: Course = new Course();
    cate0: Array<Category> = [];
    cate1: Array<Category> = [];

    constructor() {
        this.course.difficulty = "normal"
    }
}

interface Props {
    cid: string,
}

export class CourseInfo extends RenderComponent<RouteComponentProps<any>, State> {
    constructor() {
        super();
        this.state = new State();
    }

    getCid() {
        return this.props.match.params.id;
    }

    componentDidMount() {
        if (this.getCid() != "init") {
            ajaxGet("/teacher/course/" + this.getCid(), (res) => {
                this.setState({course: res})
            })
        }
        ajaxGet("/admin/category?level=0&ty=course", (res) => {
            this.setState({cate0: res})
        });
        ajaxGet("/admin/category?level=1&ty=course", (res) => {
            this.setState({cate1: res})
        })
    }

    getRenderRootMode(): { root: any; mode: string } {
        return {root: this.state, mode: "state"};
    }

    renderPairInput(name: string, ph: string) {
        return <div>
            <span>{ph}</span>
            <span>{this.renderInputText(name, ph)}</span>
        </div>
    }

    renderPairSelect(name: string, ph: string, args: any) {
        return <div>
            <span>{ph}</span>
            <span>{this.renderSelect(name, args)}</span>
        </div>
    }

    render() {
        let submit = () => {
            if (/\d+/.test(this.getCid())) {
                ajaxPut("/teacher/course/" + this.getCid(), this.state.course, () => {
                        // location.href = "/course"
                        this.props.history.push("/teacher/course")
                    }
                )
            } else {
                ajaxPost("/teacher/course", this.state.course, () => {
                        this.props.history.push("/teacher/course")
                        // location.href = "/course"
                    }
                )
            }
        };
        return <div>
            <h1>课程</h1>
            {this.renderPairInput("course.name", "课程名")}
            {this.renderPairInput("course.description", "课程描述")}
            {this.renderPairSelect("course.difficulty", "难度", Def.courseDifficultyMap)}
            {/*{this.renderPairSelect("course.categoryId", "类别", cate0)}*/}
            {this.renderPairSelect("course.cate0Id", "一级类别", Kit.optionValueList(this.state.cate0, "name", "id"))}
            {this.renderPairSelect("course.cate1Id", "二级类别", Kit.optionValueList(this.state.cate1.filter(c => c.parentId == this.state.course.cate0Id), "name", "id"))}

            <button onClick={submit}>保存</button>
        </div>
    }
}

