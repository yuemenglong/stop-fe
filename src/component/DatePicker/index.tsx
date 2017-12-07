///<reference path="../../../node_modules/@types/lodash/index.d.ts"/>
import * as React from "react"
import {Component} from "react";
import {hideLoading, showLoading} from "../../common/loading";
import _ = require("lodash");

interface Props {
    className?: string,
    onChange: (date: string) => void,
    placeholder?: string,
    value: string
}

class State {
    datepicker: any = {};
    id: string = "_DATE_PICKER_-" + new Date().valueOf().toString().slice(-5)
        + "-" + (Math.random() * 10000).toFixed(0)
}

export class DatePicker extends Component<Props, State> {
    constructor() {
        super();
        this.state = new State();
    }

    // noinspection JSUnusedGlobalSymbols
    static defaultProps = {
        className: "",
        placeholder: "请选择日期",
    };

    componentDidMount() {
        ($(`#${this.state.id}`) as any).datepicker({
            format: "yyyy-mm-dd",
            autoclose: true,
        }).on("changeDate", (e) => {
            this.props.onChange(e.target.value);
        });
    }

    render() {
        console.log(this.props.value);
        return <input className={this.props.className} onChange={_.noop}
                      type="text" id={this.state.id} value={this.props.value}
                      placeholder={this.props.placeholder}/>
    }
}
