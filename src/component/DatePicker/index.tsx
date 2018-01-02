///<reference path="../../../node_modules/@types/lodash/index.d.ts"/>
import * as React from "react"
import {Component} from "react";
import {hideLoading, showLoading} from "../../common/loading";
import _ = require("lodash");
import moment = require("moment");

interface Props {
    className?: string,
    onChange: (date: string) => void,
    placeholder?: string,
    value: string,
    disabled?: boolean,
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
        ($(`#${this.state.id}`) as any).datetimepicker({
            format: "Y-m-d",
            closeOnDateSelect: true,
            i18n: {
                en: {
                    months: [
                        '一月', '二月', '三月', '四月',
                        '五月', '六月', '七月', '八月',
                        '九月', '十月', '十一月', '十二月',
                    ],
                    dayOfWeekShort: [
                        "日", "一", "二", "三",
                        "四", "五", "六",
                    ]
                }
            },
            // lang: "zh",
            timepicker: false,
            // validateOnBlur: false,
            onSelectDate: (ct) => {
                let date = moment(ct).format("YYYY-MM-DD");
                console.log(date);
                this.props.onChange(date);
            },
            // autoclose: true,
            // }).on("changeDate", (ct) => {
            //     this.props.onChange(ct.);
        })
    }

    render() {
        return <input className={this.props.className} onChange={_.noop}
                      type="text" id={this.state.id} value={this.props.value}
                      disabled={this.props.disabled} placeholder={this.props.placeholder}/>
    }
}
