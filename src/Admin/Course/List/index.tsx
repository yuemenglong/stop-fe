import * as React from "react";
import {ListPageComponent} from "../../../common/list-page-component";
import {Course} from "../../../def/entity";
import {courseDifficultyMap} from "../../../def/data";

export class CourseList extends ListPageComponent<Course> {

    constructor() {
        super();
        this.state = {list: []} as any;
    }

    getDataUrl(): string {
        return "/course/list";
    }

    getCountUrl(): string {
        return "/course/count";
    }

    initFilter(): Object {
        return {limit: 20, offset: 0};
    }

    errorHandler(res: any): any {
        alert(res)
    }

    getPageRange(): number {
        return 4;
    }

    renderCourse(course: Course) {
        let values = [course.name, course.description, courseDifficultyMap[course.difficulty]].map((value, idx) => {
            return <td key={idx}>{value}</td>
        });
        let onDelete = () => {
            $.ajax({
                url: "/course/" + course.id,
                type: "DELETE",
                success: () => {
                    // noinspection SillyAssignmentJS
                    location.href = location.href;
                }
            })
        };
        values.push(<td key="op">
            <a href={`/course/${course.id}`}>查看</a>
            <a href="javascript:void(0)" onClick={onDelete}>删除</a>
        </td>);
        return <tr key={course.id}>{values}</tr>
    }

    // noinspection JSMethodCanBeStatic
    createCourse() {
        location.href = "/course/init"
    }


    renderPage(renderPagination: () => any, refresh: (e?: any) => void, swtch: (page: number) => void): any {
        let headers = ["课程名", "描述", "难度", "操作"];
        return <div>
            <h1>课程列表</h1>
            <button onClick={this.createCourse.bind(this)}>新增课程</button>
            <table className="table">
                <thead>
                <tr>
                    {headers.map((n, i) => <th key={i}>{n}</th>)}
                </tr>
                </thead>
                <tbody>
                {this.state.list.map(this.renderCourse.bind(this))}
                </tbody>
            </table>
            {renderPagination()}
        </div>
    }
}

