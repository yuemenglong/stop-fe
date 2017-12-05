import * as React from "react";
import {Component} from "react";
import {Route, RouteComponentProps} from "react-router";
import {RenderPairComponent} from "../../../component/RenderPair/index";
import {Modal} from "../../../common/modal";
import {WebUploader} from "../../../component/WebUploader/index";
import {Clazz} from "../../../def/entity";
import _ = require("lodash");
import {ajax, ajaxGet, ajaxPost, ajaxPut} from "../../../common/kit";
import {Link} from "react-router-dom";

class State {
    clazz: Clazz = new Clazz()
}

export class ClazzEdit extends RenderPairComponent<RouteComponentProps<any>, State> {
    constructor() {
        super();
        this.state = new State();
    }

    getRenderRootMode(): { root: any; mode: string } {
        return {root: this.state, mode: "state"}
    }

    componentDidMount() {
        if (this.getId() != "init") {
            ajaxGet(`/clazz/${this.getId()}`, (res) => {
                this.setState({clazz: res})
            })
        }
    }

    getId() {
        return this.props.match.params.id;
    }

    render() {
        let submit = () => {
            if (this.getId() == "init") {
                ajaxPost(`/clazz`, this.state.clazz, () => {
                    location.href = "/clazz"
                })
            } else {
                ajaxPut(`/clazz/${this.getId()}`, this.state.clazz, () => {
                    location.href = "/clazz"
                })
            }
        };
        return <Modal>
            {this.renderPairInputText("clazz.name", "班级名称")}
            <button className="btn" onClick={submit}>确定</button>
            <Link className="btn" to="/clazz">取消</Link>
        </Modal>
    }
}

