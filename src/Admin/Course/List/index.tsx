import * as React from "react";
import {ListPageComponent} from "../../../common/list-page-component";
import {Course} from "../../../def/entity";
import {courseDifficultyMap, JVOID0} from "../../../def/data";
import {CurdComponent} from "../../../common/curd-component";
import {EH, TEH} from "../../../common/render-component";
import {Link} from "react-router-dom";

class CourseListInner extends CurdComponent<Course> {
    idField(): string {
        return "id";
    }

    urlSlice(): number {
        return 2;
    }

    getHeaderRender(onCreate: EH, onUpdate: TEH<Course>, onDelete: TEH<Course>): Array<{ name: string; render: any }> {
        // ["课程名", "描述", "难度", "操作"];
        return [
            {name: "课程名", render: "name"},
            {name: "描述", render: "description"},
            {
                name: "难度", render: (item) => {
                return courseDifficultyMap[item.difficulty]
            }
            },
            {
                name: "操作", render: (item) => {
                return <div>
                    <a href={JVOID0} onClick={onUpdate.bind(null, item)}>查看</a>
                    <a href={JVOID0} onClick={onDelete.bind(null, item)}>删除</a>
                    {/*<a href="javascript:void(0)" onClick={onDelete}>删除</a>*/}
                </div>
            }
            },
        ]
    }

    renderContent(renderTable: () => any, renderRoute: () => any, onCreate: EH, onUpdate: TEH<Course>, onDelete: TEH<Course>): any {
        return <div>
            <h1>课程列表</h1>
            <Link to={`/course/init`}>新增课程</Link>
            {/*<button onClick={this.createCourse.bind(this)}>新增课程</button>*/}
            {renderTable()}
        </div>
    }

    itemConstructor(): Course {
        return new Course();
    }

    renderModalContent(onChange: TEH<Course>, onSubmit: EH, onCancel: EH): any {
        return undefined;
    }

    getRenderRootMode(): { root: any; mode: string; onChange?: Function } {
        return {root: this.state, mode: "state"}
    }

}

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
        // let headers = ["课程名", "描述", "难度", "操作"];
        let onChange = (list) => {
            this.setState({list: list})
        };
        let history = (this.props as any).history;
        return <div>
            {/*<h1>课程列表</h1>*/}
            {/*<button onClick={this.createCourse.bind(this)}>新增课程</button>*/}
            {/*<table className="table">*/}
            {/*<thead>*/}
            {/*<tr>*/}
            {/*{headers.map((n, i) => <th key={i}>{n}</th>)}*/}
            {/*</tr>*/}
            {/*</thead>*/}
            {/*<tbody>*/}
            {/*{this.state.list.map(this.renderCourse.bind(this))}*/}
            {/*</tbody>*/}
            {/*</table>*/}
            <CourseListInner history={history} onChange={onChange} list={this.state.list}/>
            {renderPagination()}
        </div>
    }
}

