import * as React from "react"
import {Component} from "react";
import {Kit} from "../../common/kit";
import {EH} from "../../common/render-component";

interface Props {
    list: Array<{ value: any, option: any }>
    value: any,
    onChange: EH
    className?: string
    disabled?: boolean
}

class State {
    id: string = Kit.randomId();
}

export class Chosen extends Component<Props, State> {

    constructor() {
        super();
        this.state = new State();
    }

    componentDidMount() {
        ($(`#${this.state.id}`) as any).chosen().change((e) => {
            this.props.onChange(e)
        });
    }

    render() {
        return <select className={this.props.className}
                       id={this.state.id}
                       value={this.props.value}
                       disabled={this.props.disabled}>
            {this.props.list.map(p => {
                return <option value={p.value}>{p.option}</option>
            })}
        </select>
    }
}
