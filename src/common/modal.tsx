import * as React from "react"
import {Component} from "react";
import * as ReactDOM from "react-dom";
import * as _ from "lodash";

export class Modal extends Component<any> {

    render() {
        let outerStyle = {
            position: "fixed" as "fixed",
            top: "0px",
            left: "0px",
            bottom: "0px",
            right: "0px",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
            textAlign: "center",
        };
        let innerStyle = {
            display: "inline-block",
            verticalAlign: "middle",
        };
        let afterStyle = {
            display: "inline-block",
            verticalAlign: "middle",
            height: "100%",
            width: 0,
        };
        return <div style={outerStyle}>
            <div {...this.props} style={innerStyle}>
                {this.props.children}
            </div>
            <div style={afterStyle}/>
        </div>
    }
}

export function showModal(element: any, props?: any) {
    let modal = <Modal {...props}>{element}</Modal>;
    let node = document.createElement("div");
    document.body.appendChild(node);
    ReactDOM.render(modal, node);
    return node;
}

export function hideModal(node: any) {
    ReactDOM.unmountComponentAtNode(node);
    document.body.removeChild(node);
}