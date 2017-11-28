import * as React from "react";
import {RenderComponent} from "../../../common/render-component";
import {ajax} from "../../../common/kit";
import {BaseProps} from "../../../common/common-type";
import {diffMap} from "../../../def/data";
import {Table} from "../../../common/Table";
import {Course} from "../../../def/entity";

class State {
    course: Course = new Course();

    constructor() {
        this.course.difficulty = "normal"
    }
}

interface Props {
    cid: string,
}

export class CourseInfo extends RenderComponent<Props, State> {
    constructor() {
        super();
        this.state = new State();
    }

    componentDidMount() {
        if (this.props.cid != "init") {
            ajax({
                url: "/course/" + this.props.cid,
                type: "GET",
                success: (res) => {
                    this.setState({course: res})
                }
            })
        }
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
            if (/\d+/.test(this.props.cid)) {
                ajax({
                    url: "/course/" + this.props.cid,
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
        return <div>
            <h1>课程</h1>
            {this.renderPairInput("course.name", "课程名")}
            {this.renderPairInput("course.description", "课程描述")}
            {this.renderPairSelect("course.difficulty", "难度", diffMap)}
            <button onClick={submit}>保存</button>
        </div>
    }
}

