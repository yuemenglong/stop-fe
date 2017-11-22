import * as React from "react";
import {PropsEx} from "../../common/common-type";
import {ListPageComponent} from "../../common/list-page-component";
import {Course} from "../../def/entity";
import {diffMap} from "../../def/data";

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

    renderCourse(course: Course, idx: number) {
        let values = [course.name, course.description, diffMap[course.difficulty]].map((value, idx) => {
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

    createCourse() {
        location.href = "/course/init"
    }


    renderPage(opt: { curPage: number; maxPage: number; pages: number[]; firstPage: boolean; lastPage: boolean },
               refresh: (e?: any) => void, swtch: (page: number) => void): any {
        console.log(this.state.list);
        console.log(opt);
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
            {this.renderPagination(opt, swtch)}
        </div>
    }

    renderPagination(opt: { curPage: number; maxPage: number; pages: number[]; firstPage: boolean; lastPage: boolean },
                     swtch: (page: number) => void) {
        // if(opt.pages.length == 1 && opt.pages[0] == 1){
        //     return;
        // }
        return <div>
            {opt.pages.map(p => {
                return <a key={p} onClick={swtch.bind(this, p)}>{p}</a>
            })}
        </div>
    }
}

