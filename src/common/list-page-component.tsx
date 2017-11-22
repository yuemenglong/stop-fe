import * as React from "react";
import * as _ from "lodash";
import {RenderComponent} from "./render-component";
import {ajax, encodeObject} from "./kit";

export class ListPageState<T> {
    filter: { limit: number; offset: number } = {limit: 20, offset: 0};
    list: Array<T> = [];
    count: number = 0;
}

export abstract class ListPageComponent<T, P=undefined, S extends ListPageState<T> = ListPageState<T>>
    extends RenderComponent<P, S> {

    abstract getDataUrl(): string

    abstract getCountUrl(): string

    abstract initFilter(): Object

    abstract errorHandler(res: any): any

    constructor() {
        super();
    }

    componentWillMount() {
        let filter = _.defaults(this.initFilter(), this.state.filter) as any;
        this.$refresh(filter)
        // let search = "?" + encodeObject(filter);
        // let list = this.fetch(this.getDataUrl() + search, "list");
        // let count = this.fetch(this.getCountUrl() + search, "count");
        // this.setState({filter, list, count} as any)
    }

    getRenderRootMode() {
        return {root: this.state, mode: "state"};
    }

    abstract getPageRange(): number

    abstract renderPage(opt: {
                            curPage: number, maxPage: number, pages: number[],
                            firstPage: boolean, lastPage: boolean
                        },
                        refresh: (e?: any) => void,
                        swtch: (page: number) => void): any

    $refresh(filter: any) {
        let search = "?" + encodeObject(filter);
        let dataUrl = this.getDataUrl() + search;
        let countUrl = this.getCountUrl() + search;

        this.setState({filter});
        ajax({
            url: dataUrl,
            type: "GET",
            success: (res: any) => {
                this.setState({list: res})
            }, error: (res: any) => {
                this.errorHandler(res)
            }
        });
        ajax({
            url: countUrl,
            type: "GET",
            success: (count: number) => {
                this.setState({count})
            }, error: (res: any) => {
                this.errorHandler(res)
            }
        })

    }

    $switch(page: number) {
        let offset = this.state.filter.limit * (page - 1);
        let filter = _.defaults({offset}, this.state.filter);
        this.$refresh(filter);
    }

    render(): any {
        let curPage = _.floor(this.state.filter.offset / this.state.filter.limit) + 1;
        let maxPage = _.ceil(this.state.count as number / this.state.filter.limit);
        let pages = _.range(curPage - this.getPageRange(), curPage + this.getPageRange() + 1).filter(p => {
            return 1 <= p && p <= maxPage;
        });
        let firstPage = pages[0] != 1 && pages.length > 0;
        let lastPage = pages.slice(-1)[0] != maxPage && maxPage > 0;
        return this.renderPage({curPage, maxPage, pages, firstPage, lastPage},
            this.$refresh.bind(this, this.state.filter),
            this.$switch)
    }
}
