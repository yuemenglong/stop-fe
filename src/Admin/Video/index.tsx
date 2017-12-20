import * as React from "react";
import _ = require("lodash");
import {ListPageComponent, ListPageState} from "../../common/list-page-component";
import {CurdComponent, CurdState} from "../../common/curd-component";
import {EH, TEH} from "../../common/render-component";
import {JVOID0} from "../../def/data";
import {FileInfo, WebUploader} from "../../component/WebUploader/index";
import {Video} from "../../def/entity";

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
                       onCancel: EH): any {
        let onUpload = (file: FileInfo) => {
            let video = _.clone(this.state.item);
            video.fileId = file.fileId;
            video.fileName = file.fileName;
            video.ext = file.ext;
            video.size = file.size;
            onChange(video);
        };
        let file = <WebUploader onChange={onUpload}/>;
        if (this.state.item.fileName) {
            file = <div>{this.state.item.fileName}</div>
        }
        return <div>
            {this.renderPairInputText("item.name", "名称")}
            {file}
            <button onClick={onSubmit}>确定</button>
            <button onClick={onCancel}>取消</button>
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
                <a href={`/upload/${item.fileId}`} target="_blank">下载</a>
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
        return <div>
            <h1>课件</h1>
            {renderTable()}
            <button onClick={onCreate}>添加</button>
            {renderRoute()}
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
                history={this.props.history}/>
            {renderPagination()}
        </div>
    }

    getRenderRootMode(): { root: any; mode: string } {
        return {root: this.state, mode: "state"};
    }
}

