//传进来左侧菜单的内容
import * as _ from "lodash";

function _currentLocation(leftCon: Array<{ name: string, url?: string, iconClass?: string, values?: Array<{ name: string, url: string }> }>) {
    let pathname = window.location.pathname;
    console.log('pathname', pathname)
    let locations = leftCon.map((item: any) => {
        if (!_.get(item, 'values.length')) {
            return _.get(item, 'url') == pathname ? _.get(item, 'name') : "";
        } else {
            let thisValue = item.values.filter((v: any) => {
                return _.get(v, 'url') == pathname;
            }) || [];
            let name = _.get(thisValue[0], 'name');
            return !name ? '' : _.get(item, 'name') + " > " + name;
        }
    }) || [];
    console.log('loca', locations)
    return locations.filter((item: any) => {
        return !!item;
    })[0];
}

//admin 左侧内容
export const _adminLeftCon = [
    {name: '课程体系', url: '/admin/course-category', iconClass: 'fa fa-book'},
    {
        name: '课件体系', iconClass: 'fa fa-laptop',
        values: [{name: '体系', url: '/admin/courseware-category'}, {name: '课件', url: '/admin/courseware'}]
    },
    {
        name: '视频体系', iconClass: "fa fa-play-circle",
        values: [{name: '体系', url: '/admin/video-category'}, {name: '视频', url: '/admin/video'}]
    },
    {
        name: '题目体系', iconClass: 'fa fa-newspaper-o',
        values: [{name: '体系', url: '/admin/question-category'}, {name: '题目', url: '/admin/question'}]
    },
    {
        name: '靶场体系', iconClass: 'fa fa-bullseye',
        values: [{name: '体系', url: '/admin/target-category'}, {name: '靶场题目', url: '/admin/target'}]
    }
];
//admin-左侧当前位置
export const _adminLeftLocation = _currentLocation(_adminLeftCon);