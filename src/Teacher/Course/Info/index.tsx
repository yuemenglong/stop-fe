import * as React from "react";
import {RenderComponent} from "../../../common/render-component";
import {ajax, ajaxGet} from "../../../common/kit";
import {courseDifficultyMap} from "../../../def/data";
import {Course, Category} from "../../../def/entity";
import {RouteComponentProps} from "react-router";

class State {
    course: Course = new Course();
    categorys: Array<Category> = [];

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
            ajax({
                url: "/course/" + this.getCid(),
                type: "GET",
                success: (res) => {
                    this.setState({course: res})
                }
            })
        }
        ajaxGet("/course-category?level=1&ty=course", (res) => {
            this.setState({categorys: res})
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
                ajax({
                    url: "/course/" + this.getCid(),
                    type: "PUT",
                    data: JSON.stringify(this.state.course),
                    success: () => {
                        location.href = "/course"
                    }
                })
            } else {
                ajax({
                    url: "/course",
                    type: "POST",
                    data: JSON.stringify(this.state.course),
                    success: () => {
                        location.href = "/course"
                    }
                })
            }
        };
        let categorys = this.state.categorys.map(c => {
            return {value: c.id, option: c.name};
        });
        categorys.unshift({value: "" as any, option: "请选择"});
        return <div>
            <h1>课程</h1>
            {this.renderPairInput("course.name", "课程名")}
            {this.renderPairInput("course.description", "课程描述")}
            {this.renderPairSelect("course.difficulty", "难度", courseDifficultyMap)}
            {this.renderPairSelect("course.categoryId", "类别", categorys)}
            <button onClick={submit}>保存</button>
        </div>
    }
}

