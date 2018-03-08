import * as React from "react";
import {RenderComponent, validateRegex} from "../../../common/render-component";
import {ajax, ajaxGet, ajaxPost, ajaxPut, Kit} from "../../../common/kit";
import {Course, Category} from "../../../def/entity";
import {RouteComponentProps} from "react-router";
import {Def} from "../../../def/data";
import {RenderPairComponent} from "../../../component/RenderPair/index";
import "./style.less";

class State {
    course: Course = new Course();
    cate0: Array<Category> = [];
    cate1: Array<Category> = [];

    constructor() {
        this.course.difficulty = "normal"
    }
}

export class CourseInfo extends RenderPairComponent<RouteComponentProps<any>, State> {
    constructor() {
        super();
        this.state = new State();
    }

    getRenderValidator() {
        let re = validateRegex;
        return {
            course: {
                name: re(/.+/, "请填写课程名"),
                difficulty: re(/.+/, "请选择难度"),
                cate0Id: re(/.+/, "请选择一级类别"),
                cate1Id: re(/.+/, "请选择二级类别"),
            }
        }
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

    render() {
        let submit = () => {
            let msg = this.validate();
            if (msg.length > 0) {
                alert(msg.join("\n"));
                this.setState({validate: true} as any);
                return;
            }
            this.setState({validate: false} as any);
            if (/\d+/.test(this.getCid())) {
                ajaxPut("/teacher/course/" + this.getCid(), this.state.course, () => {
                        this.props.history.push("/teacher/course")
                    }
                )
            } else {
                ajaxPost("/teacher/course", this.state.course, () => {
                        this.props.history.push("/teacher/course")
                    }
                )
            }
        };
        return <div className={'teacher-course-info'}>
            {this.renderPairInputText("course.name", "课程名")}
            {this.renderPairTextArea("course.description", "课程描述")}
            {this.renderPairCheckGroup("course.difficulty", "难度", Def.courseDifficultyMap, 'difficulty-checks')}
            {this.renderPairSelect("course.cate0Id", "一级类别", Kit.optionValueList(this.state.cate0, "name", "id"))}
            {this.renderPairSelect("course.cate1Id", "二级类别", Kit.optionValueList(this.state.cate1.filter(c => c.parentId == this.state.course.cate0Id), "name", "id"))}
            <div className={'btn-save'}>
                <button onClick={submit} className={"btn btn-primary"}>保存</button>
            </div>
        </div>
    }
}

