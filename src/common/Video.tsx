import * as React from "react"
import * as _ from "lodash";
import {Component} from "react";

interface Props {
    width?: number,
    height?: number,
    control?: boolean,
    preload?: boolean,
    src: string,
}

export class Video extends Component<Props> {

    static defaultProps = {
        width: 320, height: 240, controls: true, preload: true,
    };

    render() {
        return <video {...this.props as any}/>
    }
}
