import * as React from "react";
import _ = require("lodash");
import {ListPageComponent, ListPageState} from "../../common/list-page-component";
import {CurdComponent, CurdState} from "../../common/curd-component";
import {EH, TEH} from "../../common/render-component";
import {JVOID0} from "../../def/data";
import {WebUploader} from "../../component/WebUploader/index";
import {FileInfo, Video} from "../../def/entity";
import {ajaxGet, Kit} from "../../common/kit";
import {update} from "../../common/updater";
import './style.less';
import {_adminLeftLocation} from "../../common/common-method";

class VideoListInner extends CurdComponent<Video> {
    constructor(props) {
        super(props);
        this.state = new CurdState<Video>();
    }

    itemConstructor(): Video {
        return new Video();
    }

    renderModalContent(onChange: TEH<Video>,
                       onSubmit: EH,
                       onCancel: EH,
                       modalHeader: (item: string) => void): any {
        let onUpload = (file: FileInfo) => {
            let item = _.clone(this.state.item);
            item.file = file;
            // video.fileId = file.fileId;
            // video.fileName = file.fileName;
            // video.ext = file.ext;
            // video.size = file.size;
            onChange(item);
        };
        let file = <WebUploader onChange={onUpload}/>;
        let fileName = _.get(this.state, "item.file.fileName");
        if (fileName) {
            file = <div>{fileName}</div>
        }
        return <div className={'modal-content video-modal-add'}>
            {modalHeader('新增视频')}
            <div className={'modal-body'}>
                {this.renderPairInputText("item.name", "名称")}
                {file}
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

    getHeaderRender(onCreate: EH, onUpdate: TEH<Video>, onDelete: TEH<Video>): Array<{ name: string; render: any }> {
        return [{
            name: "名称", render: "name",
        }, {
            name: "类型", render: "ext",
        }, {
            name: "大小", render: "size",
        }, {
            name: "操作", render: (item: Video) => <div>
                <a href={`/upload/${item.file.fileId}`} target="_blank">下载</a>
                <a href={JVOID0} onClick={onUpdate.bind(null, item)}>修改</a>
                <a href={JVOID0} onClick={onDelete.bind(null, item)}>删除</a>
            </div>
        }];
    }

    renderContent(renderTable: () => any,
                  renderRoute: () => any,
                  onCreate: EH,
                  onUpdate: TEH<Video>,
                  onDelete: TEH<Video>): any {
        return <div className={'video-con'}>
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

export class VideoList extends ListPageComponent<Video> {
    constructor(props) {
        super(props);
        this.state = new ListPageState<Video>();
    }

    componentDidMount() {
        ajaxGet(`/admin/category?ty=video&level=0`, (res) => {
            let data = update(this.state.data, "cate0", res);
            this.setState({data});
        });
        ajaxGet(`/admin/category?ty=video&level=1`, (res) => {
            let data = update(this.state.data, "cate1", res);
            this.setState({data});
        })
    }

    getDataUrl(): string {
        return "/admin/video/list";
    }

    getCountUrl(): string {
        return "/admin/video/count";
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
            <VideoListInner
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

