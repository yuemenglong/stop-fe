import * as React from "react"
import {RenderComponent} from "../../common/render-component";

export abstract class RenderPairComponent<P={}, S={}> extends RenderComponent<P, S> {
    // noinspection JSUnusedGlobalSymbols
    renderPairInputText(name: string, ph: string) {
        return <div>
            <span>{ph}</span>
            <span>{this.renderInputText(name, ph)}</span>
        </div>
    }

    // noinspection JSUnusedGlobalSymbols
    renderPairSelect(name: string, ph: string, args: any) {
        return <div>
            <span>{ph}</span>
            <span>{this.renderSelect(name, args)}</span>
        </div>
    }
}
