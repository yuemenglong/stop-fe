import * as React from "react";
import {ListPageComponent} from "../../../common/list-page-component";
import {Course} from "../../../def/entity";
import {Def, JVOID0} from "../../../def/data";
import {CurdComponent} from "../../../common/curd-component";
import {EH, TEH} from "../../../common/render-component";
import {Link} from "react-router-dom";
import {ajaxDelete} from "../../../common/kit";
import {_teacherLeftLocation} from "../../../common/common-method";
import './style.less';

class CourseListInner extends CurdComponent<Course> {
    idField(): string {
        return "id";
    }

    urlSlice(): number {
        return 3;
    }

    getHeaderRender(onCreate: EH, onUpdate: TEH<Course>, onDelete: TEH<Course>): Array<{ name: string; render: any }> {
        // ["课程名", "描述", "难度", "操作"];
        return [
            {name: "课程名", render: "name"},
            {name: "描述", render: "description"},
            {
                name: "难度", render: (item) => {
                return Def.courseDifficultyMap[item.difficulty]
            }
            },
            {
                name: "操作", render: (item) => {
                return <div className={'course-table-btns'}>
                    <Link to={`/teacher/course/${item.id}`}>查看</Link>
                    <a href={JVOID0} onClick={onDelete.bind(null, item)}>删除</a>
                </div>
            }
            },
        ]
    }

    renderContent(renderTable: (className: string) => any, renderRoute: () => any, onCreate: EH, onUpdate: TEH<Course>, onDelete: TEH<Course>): any {
        return <div className={'teacher-course-list-con'}>
            <div>{"当前位置：" + _teacherLeftLocation}</div>
            <div className={'box'}>
                <Link to={`/teacher/course/init`} className={'btn bg-orange btn-add'}>新增课程</Link>
                {renderTable("course-list-table")}
            </div>
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
        return "/teacher/course/list";
    }

    getCountUrl(): string {
        return "/teacher/course/count";
    }

    initFilter(): Object {
        return {limit: 20, offset: 0};
    }

    getPageRange(): number {
        return 4;
    }

    renderCourse(course: Course) {
        let values = [course.name, course.description, Def.courseDifficultyMap[course.difficulty]].map((value, idx) => {
            return <td key={idx}>{value}</td>
        });
        let onDelete = () => {
            ajaxDelete("/teacher/course/" + course.id, () => {
                    // noinspection SillyAssignmentJS
                    location.href = location.href;
                }
            )
        };
        values.push(<td key="op">
            <a href={`/course/${course.id}`}>查看</a>
            <a href="javascript:void(0)" onClick={onDelete}>删除</a>
        </td>);
        return <tr key={course.id}>{values}</tr>
    }

    renderPage(renderPagination: () => any, refresh: (e?: any) => void, swtch: (page: number) => void): any {
        let onChange = (list) => {
            this.setState({list: list})
        };
        let history = (this.props as any).history;
        return <div className={'teacher-course-list-content'}>
            <CourseListInner history={history} onChange={onChange} list={this.state.list}/>
            {renderPagination()}
        </div>
    }
}

