//传进来左侧菜单的内容
import * as _ from "lodash";

function _currentLocation(leftCon: Array<{ name: string, url?: string, iconClass?: string, values?: Array<{ name: string, url: string }> }>) {
    let pathname = window.location.pathname;
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

//teacher 左侧内容
export const _teacherLeftCon = [
    {name: '课程列表', url: "/teacher/course", iconClass: 'fa fa-book'},
    {name: '学生列表', url: "/teacher/student", iconClass: 'fa fa-book'},
    {name: '班级列表', url: "/teacher/clazz", iconClass: 'fa fa-book'},
    {name: '学习任务', url: "/teacher/study-job", iconClass: 'fa fa-book'},
    {name: '考试任务', url: "/teacher/quiz", iconClass: 'fa fa-book'}
];

//teacher -左侧当前位置
export const _teacherLeftLocation = _currentLocation(_teacherLeftCon);

//user-左侧内容
export const _userLeftCon = (uid: string) => {
    return [{name: '靶场', url: `/user/${uid}/target`},
        {name: '查看课件', url: `/user/${uid}/courseware`},
        {name: '查看视频', url: `/user/${uid}/video`},
        {name: '查看队伍', url: `/user/${uid}/team`},
        {name: '学习任务', url: `/user/${uid}/study-job`},
        {name: '考试任务', url: `/user/${uid}/quiz-job`}];
};

//user-获得当前位置
export const _userLeftLocation = (uid: string) => {
    return _currentLocation(_userLeftCon(uid));
};

//user-获得用户id
export function _getUid() {
    let m = location.pathname.match(/^\/user\/(\d+).*$/);
    if (!m) {
        return;
    }
    return m[1];
}