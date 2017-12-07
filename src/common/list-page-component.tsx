import * as React from "react";
import * as _ from "lodash";
import {RenderComponent} from "./render-component";
import {ajax, encodeObject} from "./kit";

export class ListPageState<T> {
    filter: { limit: number; offset: number } = {limit: 20, offset: 0};
    list: Array<T> = [];
    count: number = 0;
}

export interface ListPageProps {
    match?: any;
    history?: any;
    data?: any;
}

export abstract class ListPageComponent<T,
    P extends ListPageProps = ListPageProps,
    S extends ListPageState<T> = ListPageState<T>>
    extends RenderComponent<P, S> {

    abstract getDataUrl(): string

    abstract getCountUrl(): string

    abstract initFilter(): Object

    errorHandler(res: any) {
        alert(res.responseText);
    }

    constructor(props?) {
        super(props);
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

    abstract renderPage(renderPagination: () => any,
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

    renderPagination(curPage: number, maxPage: number, pages: number[],
                     firstPage: boolean, lastPage: boolean,
                     refresh: () => void, swtch: (page: number) => void) {
        if (maxPage == 1) {
            return <ol/>
        }
        let ret = pages.map((p) => {
            let middleClassName = curPage === p ? "active" : "";
            return <li key={p}><a onClick={swtch.bind(this, p)} className={middleClassName}>{p}</a></li>
        });
        if (firstPage) {
            let firstClassName = curPage === 1 ? "active" : "";
            let first = <li key={1}><a onClick={swtch.bind(this, 1)} className={firstClassName}>{1}</a></li>;
            ret.unshift(<li key="first">...</li>);
            ret.unshift(first);
        }
        if (lastPage) {
            let lastClassName = curPage === maxPage ? "active" : "";
            let last = <li key={maxPage}><a onClick={swtch.bind(this, maxPage)}
                                            className={lastClassName}>{maxPage}</a></li>;
            ret.push(<li key="last">...</li>);
            ret.push(last);
        }
        return <ol className="pagination">{ret}</ol>
    }

    render(): any {
        let curPage = _.floor(this.state.filter.offset / this.state.filter.limit) + 1;
        let maxPage = _.ceil(this.state.count as number / this.state.filter.limit);
        let pages = _.range(curPage - this.getPageRange(), curPage + this.getPageRange() + 1).filter(p => {
            return 1 <= p && p <= maxPage;
        });
        let firstPage = pages[0] != 1 && pages.length > 0;
        let lastPage = pages.slice(-1)[0] != maxPage && maxPage > 0;
        let refresh = this.$refresh.bind(this, this.state.filter);
        let swtch = this.$switch.bind(this);
        let renderpagination = this.renderPagination.bind(this, curPage, maxPage,
            pages, firstPage, lastPage, refresh, swtch);
        return this.renderPage(renderpagination, refresh, swtch);
    }
}
