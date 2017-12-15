import * as React from "react";
import {Component} from "react";
import {Route, RouteComponentProps} from "react-router";
import {RenderPairComponent} from "../../../component/RenderPair/index";
import {Modal} from "../../../common/modal";
import {WebUploader} from "../../../component/WebUploader/index";
import {Clazz, Student} from "../../../def/entity";
import _ = require("lodash");
import {ajax, ajaxGet, ajaxPost, ajaxPut} from "../../../common/kit";
import {Link} from "react-router-dom";
import {Table} from "../../../common/Table";
import {SelectorComponent} from "../../../common/selector-component";
import {EH} from "../../../common/render-component";
import {JVOID0} from "../../../def/data";


class Selector extends SelectorComponent<Student> {
    itemKey(item: Student): string {
        return item.id as any;
    }

    renderItem(item: Student, idx: number, key: string, checked: boolean, onChange: EH): any {
        let tds = ["userName", "mobile", "email"].map(key => {
            return <td key={key}>{item[key]}</td>;
        });
        let chk = <td key={"chk"}><input type="checkbox" checked={checked} onChange={onChange}/></td>;
        tds.unshift(chk);
        return <tr key={key}>{tds}</tr>;
    }

    renderContent(renderItem: (item: Student, idx: number) => any, checkedAll: boolean, onChangeAll: () => void): any {
        return <table className="table">
            <thead>
            <tr>
                <th>选择</th>
                <th>姓名</th>
                <th>电话</th>
                <th>邮箱</th>
            </tr>
            </thead>
            <tbody>
            {this.props.list.map(renderItem)}
            </tbody>
        </table>
    }

    getRenderRootMode(): { root: any; mode: string } {
        return undefined;
    }

}

class State {
    students: Array<Student> = [];
    selected: Array<Student> = [];
}

interface Props {
    onSelect: (selected) => any
    onCancel: () => any
    match: any
}

export class ClazzStudentSelector extends RenderPairComponent<Props, State> {
    constructor() {
        super();
        this.state = new State();
    }

    getRenderRootMode(): { root: any; mode: string } {
        return {root: this.state, mode: "state"}
    }

    componentDidMount() {
        ajaxGet(`/teacher/clazz/${this.getId()}/students?clazzId=0`, (res) => {
            this.setState({students: res})
        })
    }

    getId() {
        return this.props.match.params.id;
    }

    render() {
        let onChange = (selected) => {
            this.setState({selected})
        };
        let submit = () => {
            let data = this.state.selected.map(s => s.id);
            ajaxPost(`/teacher/clazz/${this.getId()}/students`, data, () => {
                // location.href = `/clazz/${this.getId()}/student`
                // this.props.history.push(`/teacher/clazz/${this.getId()}/student`)
                this.props.onSelect(this.state.selected)
            })
        };
        return <div>
            <Selector list={this.state.students} onChange={onChange} selected={this.state.selected} maxSelect={10000}/>
            <button onClick={submit}>确定</button>
            <a href={JVOID0} onClick={this.props.onCancel}>取消</a>
        </div>
    }
}

