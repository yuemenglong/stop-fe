import * as React from "react"
import {Component} from "react";
import {hideLoading, showLoading} from "../../common/loading";

interface Props {
    list: Array<{ value: string | number, option: string | number }>
    value: string | number
    onChange: (value: string | number) => any
    className?: string
    invert?: boolean
}

export class CheckGroup extends Component<Props> {
    static defaultProps = {
        invert: true
    };

    render() {
        let onChange = (item, e) => {
            if (!this.props.invert && item.value == this.props.value) {
                // 不能反选
                return;
            }
            if (item.value == this.props.value) {
                this.props.onChange(null)
            } else {
                this.props.onChange(item.value)
            }
        };
        return <ul className={this.props.className}>
            {this.props.list.map((o: { value: string | number, option: string | number }) => {
                let checked = this.props.value == o.value;
                return <li key={o.value}>
                    <input type="checkbox" checked={checked}
                           onChange={onChange.bind(null, o)}/>
                    <span>{o.option}</span>
                </li>
            })}
        </ul>
    }
}
