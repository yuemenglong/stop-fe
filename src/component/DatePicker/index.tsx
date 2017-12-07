import * as React from "react"
import {Component} from "react";
import {hideLoading, showLoading} from "../../common/loading";

interface Props {
    id: string,
    className?: string,
    onChange: (date: string) => void,
    placeholder?: string,
}

class State {
    datepicker: any = {};
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
        ($(`#${this.props.id}`) as any).datepicker({
            format: "yyyy-mm-dd",
            autoclose: true,
        }).on("changeDate", (e) => {
            this.props.onChange(e.target.value);
            console.log(e)
        });
    }

    render() {
        return <div className={this.props.className}>
            <input type="text" id={this.props.id} placeholder={this.props.placeholder}/>
        </div>
    }
}
