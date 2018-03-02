import * as React from "react"
import {RenderComponent} from "../../common/render-component";
import './style.less';

export abstract class RenderPairComponent<P={}, S={}> extends RenderComponent<P, S> {
    renderPairText(name: string, ph: string, className?: string) {
        return <div>
            <span>{ph}</span>
            <span>{this.$getValue(name)}</span>
        </div>
    }

    // noinspection JSUnusedGlobalSymbols
    renderPairInputText(name: string, ph: string, className?: string) {
        return <div className={'render-pair-input-text'}>
            <span>{ph}</span>
            <span>{this.renderInputText(name, ph, className)}</span>
        </div>
    }

    // noinspection JSUnusedGlobalSymbols
    renderPairInputPassword(name: string, ph: string, className?: string) {
        return <div className={'render-pair-input-password'}>
            <span>{ph}</span>
            <span>{this.renderInputPassword(name, ph, className)}</span>
        </div>
    }

    // noinspection JSUnusedGlobalSymbols
    renderPairSelect(name: string, ph: string, args: any, className?: string, props?: any) {
        return <div className={'render-pair-select'}>
            <span>{ph}</span>
            <span>{this.renderSelect(name, args, className, props)}</span>
        </div>
    }

    // noinspection JSUnusedGlobalSymbols
    renderPairChosen(name: string, ph: string, args: any, className?: string, props?: any) {
        return <div>
            <span>{ph}</span>
            <span>{this.renderChosen(name, args, className, props)}</span>
        </div>
    }

    // noinspection JSUnusedGlobalSymbols
    renderPairCheckGroup(name: string, ph: string, args: any, className?: string) {
        return <div className={'render-pair-check-group'}>
            <span>{ph}</span>
            <span>{this.renderCheckGroup(name, args, className)}</span>
        </div>
    }

    // noinspection JSUnusedGlobalSymbols
    renderPairTextArea(name: string, ph: string, className?: string) {
        return <div className={'render-pair-text-area'}>
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
