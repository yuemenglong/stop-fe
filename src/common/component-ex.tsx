import * as React from "react"
import {Component} from "react";
import {Fetch} from "./fetch";

function noop(obj: any) {
    return obj;
}

type EH = (e: any) => void

export class ComponentEx<P={}, S={}> extends Component<P, S> {
    fetch(url: string, arg: string | Function, fn: Function = noop) {
        let ret = Fetch.fetch(url, (res: any) => {
            if (typeof arg == "function") {
                return arg(res);
            } else {
                let state = {} as any;
                state[arg] = fn(res);
                this.setState(state);
            }
        });
        if (ret != null) {
            return fn(ret);
        } else {
            return ret;
        }
    }
}
