import * as React from "react";
import {RenderComponent} from "../../common/render-component";
import {ajax} from "../../common/kit";
import {PropsEx} from "../../common/common-type";
import {diffMap} from "../../def/data";

export class CourseEdit extends RenderComponent<PropsEx, any> {
    constructor() {
        super();
        this.state = {difficulty: "normal"};
    }

    componentDidMount() {
        if (this.props.match.params.id != "init") {
            ajax({
                url: "/course/" + this.props.match.params.id,
                type: "GET",
                success: (res) => {
                    this.setState(res)
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
            if (this.props.match.params.id) {
                ajax({
                    url: "/course/" + this.props.match.params.id,
                    type: "PUT",
                    data: JSON.stringify(this.state),
                    success: () => {
                        location.href = "/course"
                    }
                })
            } else {
                ajax({
                    url: "/course",
                    type: "POST",
                    data: JSON.stringify(this.state),
                    success: () => {
                        location.href = "/course"
                    }
                })
            }
        };
        return <div>
            <h1>课程</h1>
            {this.renderPairInput("name", "课程名")}
            {this.renderPairInput("description", "课程描述")}
            {this.renderPairSelect("difficulty", "难度", diffMap)}
            <button onClick={submit}>保存</button>
        </div>
    }
}

