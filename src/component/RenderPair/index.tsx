import * as React from "react"
import {RenderComponent} from "../../common/render-component";

export abstract class RenderPairComponent<P={}, S={}> extends RenderComponent<P, S> {
    // noinspection JSUnusedGlobalSymbols
    renderPairInputText(name: string, ph: string, className?: string) {
        return <div>
            <span>{ph}</span>
            <span>{this.renderInputText(name, ph, className)}</span>
        </div>
    }

    // noinspection JSUnusedGlobalSymbols
    renderPairInputPassword(name: string, ph: string, className?: string) {
        return <div>
            <span>{ph}</span>
            <span>{this.renderInputPassword(name, ph, className)}</span>
        </div>
    }

    // noinspection JSUnusedGlobalSymbols
    renderPairSelect(name: string, ph: string, args: any, className?: string) {
        return <div>
            <span>{ph}</span>
            <span>{this.renderSelect(name, args, className)}</span>
        </div>
    }

    // noinspection JSUnusedGlobalSymbols
    renderPairTextArea(name: string, ph: string, className?: string) {
        return <div>
            <span>{ph}</span>
            <span>{this.renderTextarea(name, ph, className)}</span>
        </div>
    }

    // noinspection JSUnusedGlobalSymbols
    renderPairDatePicker(name: string, ph: string, className?: string) {
        return <div>
            <span>{ph}</span>
            <span>{this.renderDatePicker(name, ph, className)}</span>
        </div>
    }
}
