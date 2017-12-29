import * as React from "react"
import * as _ from "lodash";
import {ComponentEx} from "./component-ex";
import {DatePicker} from "../component/DatePicker/index";
import {CheckGroup} from "../component/CheckGroup/index";
import {Chosen} from "../component/Chosen/index";

export class OptionItem {
    value: string | number = null;
    option: string = null;
}

export type EH = (e?: any) => any
export type TEH<T> = (item: T) => any

export function validateRegex(re: RegExp, msg: string, allowNull: boolean = false): (v: any, ac: number[]) => string {
    return (value: any, ac: number[]) => {
        if ((!allowNull && value == null) || !re.test(value)) {
            (ac || []).forEach((n, idx) => {
                msg = msg.replace(`$${idx}`, n as any)
            });
            return msg;
        }
    }
}

// noinspection JSUnusedGlobalSymbols
export function validateNotNull(validator: any, msg: string) {
    return (value: any) => {
        if (value != null) {
            return validate(value, validator)
        } else {
            return msg
        }
    }
}

export function validate(obj: any, validator: any): String[] {
    let ret: any = [];

    function go(o: any, v: any, ac: number[]) {
        if (_.isArray(v) && !_.isArray(o)) {
            throw Error("Not Array Data For Array Validator")
        }
        if (_.isArray(v) && v.length != 1) {
            throw Error("Array Validator Only Need One Item")
        }
        if (_.isArray(v)) {
            o.map((item: any, idx: number) => go(item, v[0], ac.concat([idx])));
        } else if (_.isFunction(v)) { // 执行验证逻辑
            ret.push(v(o, ac))
        } else if (o == null) {
            // 不用验证了
        } else if (_.isPlainObject(v)) {
            // 不是数组不是方法只能是对象
            _.keys(v).forEach(name => {
                let v2 = v[name];
                let o2 = o[name];
                go(o2, v2, ac)
            })
        } else {
            // 只能是 数组 函数 对象 之一
            throw Error("Object And Validator Not Match")
        }
    }

    go(obj, validator, []);


    return _.flattenDeep(ret).filter(_.isString)
}

// validate属性
// invalid样式
export abstract class RenderComponent<P={}, S={}> extends ComponentEx<P, S> {
    abstract getRenderRootMode(): { root: any, mode: string, onChange?: Function }

    // noinspection JSMethodCanBeStatic
    getRenderValidator(): any {
        return {}
    }

    // noinspection JSMethodCanBeStatic
    getRenderChangeValidator(): any {
        return {}
    }

    validate(): Array<String> {
        let obj = this.getRenderRootMode().root;
        let validator = this.getRenderValidator();
        return validate(obj, validator);
    }

    $needValidate() {
        return _.get(this, "props.validate") || _.get(this, "state.validate");
    }

    $validateField(path: string): string {
        let vpath = path.replace(/\[\d+\]/g, "[0]");
        let fn = _.get(this.getRenderValidator(), vpath) as Function;
        if (!fn) {
            return null;
        }
        let value = this.$getValue(path);
        return fn(value)
    }

    $validateChangeField(path: string): string {
        let fn = _.get(this.getRenderChangeValidator(), path) as Function;
        if (!fn) {
            return null;
        }
        let value = this.$getValue(path);
        return fn(value)
    }

    $setValue(key: string, value: any) {
        let {root, mode, onChange} = this.getRenderRootMode();
        if (mode == "state") {
            // state
            if (this.state != root) throw Error("State Must Be The Root");
            let state = _.cloneDeep(this.state);
            _.set(state, key, value);
            this.setState(state)
        } else if (mode == "props") {
            // props
            let item = _.cloneDeep(root);
            _.set(item, key, value);
            (onChange || (this as any).onChange || (this.props as any).onChange).call(this, item);
        } else if (mode == "custom") {
            // 自定义
            let item = _.cloneDeep(root);
            _.set(item, key, value);
            onChange(item)
        } else if (mode == "mobx") {
            // mobx
            _.set(root, key, value);
        } else {
            throw Error("Unknown Mode: " + mode)
        }
    }

    $getValue(key: string): any {
        return _.get(this.getRenderRootMode().root, key, "")
    }

    renderInputText(name: string, placeholder?: string,
                    className?: string, props?: any) {
        let onChange = (e: any) => {
            if (!this.$validateChangeField(name)) {
                this.$setValue(name, e.target.value);
            }
        };
        if (this.$needValidate() && this.$validateField(name)) {
            className = [className, "invalid"].filter(_.isString).join(" ");
        }
        let disabled = (this.props as any).disabled || (this.state as any).disabled;
        props = _.merge({onChange}, props);

        let value = this.$getValue(name) as string;
        return <input type="text" className={className} name={name} value={value}
                      disabled={disabled} placeholder={placeholder} {...props}/>
    }

    renderInputPassword(name: string, placeholder?: string,
                        className?: string, props?: any) {
        let onChange = (e: any) => {
            this.$setValue(name, e.target.value);
        };
        if (this.$needValidate() && this.$validateField(name)) {
            className = [className, "invalid"].filter(_.isString).join(" ")
        }
        let disabled = (this.props as any).disabled || (this.state as any).disabled;
        props = _.merge({onChange}, props);

        let value = this.$getValue(name) as string;
        return <input type="password" className={className} name={name} value={value}
                      disabled={disabled} placeholder={placeholder} {...props}/>
    }

    renderTextarea(name: string, placeholder?: string,
                   className?: string, props?: any) {
        let onChange = (e: any) => {
            this.$setValue(name, e.target.value)
        };
        if (this.$needValidate() && this.$validateField(name)) {
            className = [className, "invalid"].filter(_.isString).join(" ")
        }
        let disabled = (this.props as any).disabled || (this.state as any).disabled;
        props = _.merge({onChange}, props);

        let value = this.$getValue(name) as string;
        return <textarea value={value} name={name} className={className}
                         disabled={disabled} placeholder={placeholder} {...props}/>
    }

    renderSelect(name: string, list: Array<{ value: string | number, option: string | number }> | Object,
                 className?: string, props?: any) {
        let onChange = (e: any) => {
            this.$setValue(name, e.target.value)
        };
        if (this.$needValidate() && this.$validateField(name)) {
            className = [className, "invalid"].filter(_.isString).join(" ")
        }
        let disabled = (this.props as any).disabled || (this.state as any).disabled;
        props = _.merge({onChange}, props);
        if (_.isPlainObject(list)) {
            list = _(list).toPairs().map(p => {
                return {value: p[0], option: p[1]};
            }).value();
        }

        let value = this.$getValue(name) as string;
        return <select disabled={disabled} className={className} title={value} value={value}
                       name={name} {...props}>
            {(list as any).map(o => {
                return <option key={o.value} value={o.value}>{o.option}</option>
            })}
        </select>
    }

    renderChosen(name: string, list: Array<{ value: string | number, option: string | number }> | Object,
                 className?: string, props?: any) {
        let onChange = (e: any) => {
            this.$setValue(name, e.target.value)
        };
        if (this.$needValidate() && this.$validateField(name)) {
            className = [className, "invalid"].filter(_.isString).join(" ")
        }
        let disabled = (this.props as any).disabled || (this.state as any).disabled;
        props = _.merge({onChange, disabled, className}, props);
        if (_.isPlainObject(list)) {
            list = _(list).toPairs().map(p => {
                return {value: p[0], option: p[1]};
            }).value();
        }

        let value = this.$getValue(name) as string;
        return <Chosen list={list} value={value} {...props}/>
    }

    renderCheckGroup(name: string, list: Array<{ value: string | number, option: string | number }> | Object,
                     className?: string, props?: any) {
        let onChange = (e: any) => {
            this.$setValue(name, e)
        };
        if (this.$needValidate() && this.$validateField(name)) {
            className = [className, "invalid"].filter(_.isString).join(" ")
        }
        let disabled = (this.props as any).disabled || (this.state as any).disabled;
        props = _.merge({onChange}, props);
        if (_.isPlainObject(list)) {
            list = _(list).toPairs().map(p => {
                return {value: p[0], option: p[1]};
            }).value();
        }

        let value = this.$getValue(name) as string;
        return <CheckGroup disabled={disabled} className={className} value={value} list={list} {...props}/>
    }

    // 复选框
    renderCheckbox(name: string, className?: string, props?: any) {
        let onChange = (e: any) => {
            this.$setValue(name, e.target.checked);
        };
        let disabled = (this.props as any).disabled || (this.state as any).disabled;
        props = _.merge({onChange}, props);

        let checked = this.$getValue(name) as boolean;
        let value = this.$getValue(name) as string;
        return <input disabled={disabled} type="checkbox"
                      className={className} name={name} checked={checked}
                      value={value} {...props}/>
    }

    renderDatePicker(name: string, placeholder?: string,
                     className?: string, props?: any) {
        let onChange = (date: string) => {
            if (!this.$validateChangeField(name)) {
                this.$setValue(name, date);
            }
        };
        if (this.$needValidate() && this.$validateField(name)) {
            className = [className, "invalid"].filter(_.isString).join(" ");
        }
        let disabled = (this.props as any).disabled || (this.state as any).disabled;
        props = _.merge({onChange}, props);

        let value = this.$getValue(name) as string;
        return <DatePicker className={className} value={value}
                           disabled={disabled} placeholder={placeholder} {...props}/>
    }
}
