import * as React from "react";
import _ = require("lodash");
import {ListPageComponent, ListPageState} from "../../common/list-page-component";
import {CurdComponent, CurdState} from "../../common/curd-component";
import {EH, TEH, validateRegex} from "../../common/render-component";
import {JVOID0} from "../../def/data";
import {WebUploader} from "../../component/WebUploader/index";
import {Courseware, FileInfo} from "../../def/entity";
import {ajaxGet, Kit} from "../../common/kit";
import {update} from "../../common/updater";
import './style.less';
import {_adminLeftLocation} from "../../common/common-method";

class CoursewareListInner extends CurdComponent<Courseware> {
    constructor(props) {
        super(props);
        this.state = new CurdState<Courseware>();
    }

    getRenderValidator() {
        let re = validateRegex;
        return {
            item: {
                name: re(/.+/, "请输入姓名")
            }
        }
    }

    itemConstructor(): Courseware {
        return new Courseware();
    }

    renderModalContent(onChange: TEH<Courseware>,
                       onSubmit: EH,
                       onCancel: EH,
                       modalHeader: (item: string) => void): any {
        let onUpload = (file: FileInfo) => {
            let item = _.clone(this.state.item);
            item.file = file;
            onChange(item);
        };
        let accept = {
            extensions: "ppt,pptx",
            mimeTypes: "application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
        };
        let fileName = _.get(this.state, "item.file.fileName");
        let inb = {display: "inline-block"};
        let file = <div style={inb}>
            <WebUploader onChange={onUpload} accept={accept}/>
            <span className={'tip'}>请上传ppt,pptx格式</span>
        </div>;
        if (fileName) {
            file = <div style={inb}>{fileName}</div>;
        }
        return <div className={'modal-content courseware-modal-add'}>
            {modalHeader('新增课件')}
            <div className={'modal-body'}>
                {this.renderPairInputText("item.name", "名称")}
                <div className={'admin-upload'}><span className={'upload-title'}>文件</span>{file}</div>
                {this.renderPairSelect("item.cate0Id", "一级类别", Kit.optionValueList(this.props.data.cate0, "name", "id"))}
                {this.renderPairSelect("item.cate1Id", "二级类别", Kit.optionValueList(this.props.data.cate1.filter(c => c.parentId == this.state.item.cate0Id), "name", "id"))}
            </div>
            <div className={'modal-footer'}>
                <button onClick={onCancel} className={'btn btn-default'}>取消</button>
                <button onClick={onSubmit} className={'btn btn-primary'}>确定</button>
            </div>
        </div>
    }

    urlSlice(): number {
        return 5;
    }

    idField(): string {
        return "id";
    }

    getHeaderRender(onCreate: EH, onUpdate: TEH<Courseware>, onDelete: TEH<Courseware>): Array<{ name: string; render: any }> {
        return [{
            name: "名称", render: "name",
        }, {
            name: "类型", render: "file.ext",
        }, {
            name: "大小", render: "file.size",
        }, {
            name: "操作", render: (item: Courseware) => <div className={'courseware-table-btn'}>
                <a href={`/upload/${item.file.fileId}`} target="_blank">下载</a>
                <a href={JVOID0} onClick={onUpdate.bind(null, item)}>修改</a>
                <a href={JVOID0} onClick={onDelete.bind(null, item)}>删除</a>
            </div>
        }];
    }

    renderContent(renderTable: () => any,
                  renderRoute: () => any,
                  onCreate: EH,
                  onUpdate: TEH<Courseware>,
                  onDelete: TEH<Courseware>): any {
        return <div className={'courseware-con'}>
            <div>{'当前位置：' + _adminLeftLocation}</div>
            <div className={'box'}>
                <button onClick={onCreate} className={'btn bg-orange btn-add'}>新增</button>
                {renderTable()}
                {renderRoute()}
            </div>
        </div>
    }

    getRenderRootMode(): { root: any; mode: string } {
        return {root: this.state, mode: "state"};
    }
}

export class CoursewareList extends ListPageComponent<Courseware> {
    constructor(props) {
        super(props);
        this.state = new ListPageState<Courseware>();
    }

    componentDidMount() {
        ajaxGet(`/admin/category?ty=courseware&level=0`, (res) => {
            let data = update(this.state.data, "cate0", res);
            this.setState({data});
        });
        ajaxGet(`/admin/category?ty=courseware&level=1`, (res) => {
            let data = update(this.state.data, "cate1", res);
            this.setState({data});
        })
    }

    getDataUrl(): string {
        return "/admin/courseware/list";
    }

    getCountUrl(): string {
        return "/admin/courseware/count";
    }

    initFilter(): Object {
        return {};
    }

    getPageRange(): number {
        return 4;
    }

    renderPage(renderPagination: () => any, refresh: (e?: any) => void, swtch: (page: number) => void): any {
        let onChange = (list) => {
            this.setState({list})
        };
        return <div>
            <CoursewareListInner
                list={this.state.list}
                onChange={onChange}
                history={this.props.history}
                data={this.state.data}/>
            {renderPagination()}
        </div>
    }

    getRenderRootMode(): { root: any; mode: string } {
        return {root: this.state, mode: "state"};
    }
}

