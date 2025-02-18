import { createRouter, createWebHistory } from 'vue-router'
import { store } from '@/indexApp/js/store.js'

const Index = () => import('@/indexApp/routes/Index.vue')
const Explore = () => import('@/indexApp/routes/Explore.vue')
// const Manage = () => import('@/indexApp/routes/Manage.vue')
const Search = () => import('@/indexApp/routes/Search.vue')
const Bookmark = () => import('@/indexApp/routes/Bookmark.vue')
const Follow = () => import('@/indexApp/routes/Follow.vue')
const FollowList = () => import('@/indexApp/routes/follow/FollowList.vue')
const FanList = () => import('@/indexApp/routes/follow/FanList.vue')
const ReplyDetail = () => import('@/indexApp/routes/ReplyDetail.vue')

const PostDetail = () => import('@/indexApp/routes/PostDetail.vue')
const PostLikeListPage = () => import('@/indexApp/routes/postDetail/PostLikeListPage.vue')
const PostReviewListPage = () => import('@/indexApp/routes/postDetail/PostReviewListPage.vue')
const PostRepostListPage = () => import('@/indexApp/routes/postDetail/PostRepostListPage.vue')

const Notify = () => import('@/indexApp/routes/Notify.vue')
const NotifyAllNotifyTimePage = () => import('@/indexApp/routes/notify/AllNotifyTimelinePage.vue')
const NotifyLikeNotifyTimePage = () => import('@/indexApp/routes/notify/LikeNotifyTimelinePage.vue')
const NotifyReviewNotifyTimePage = () => import('@/indexApp/routes/notify/ReviewNotifyTimelinePage.vue')
const NotifyFanNotifyTimePage = () => import('@/indexApp/routes/notify/FanNotifyTimelinePage.vue')
const NotifyRepostNotifyTimePage = () => import('@/indexApp/routes/notify/RepostNotifyTimelinePage.vue')
const NotifyAtSignNotifyTimePage = () => import('@/indexApp/routes/notify/AtSignNotifyTimelinePage.vue')
const NotifySysNotifyTimePage = () => import('@/indexApp/routes/notify/SysNotifyTimelinePage.vue')

const Profile = () => import('@/indexApp/routes/Profile.vue')
const ProfilePostTimelinePage = () => import('@/indexApp/routes/profile/PostTimelinePage.vue')
const ProfileReviewTimelinePage = () => import('@/indexApp/routes/profile/ReviewTimelinePage.vue')
const ProfileMediaTimelinePage = () => import('@/indexApp/routes/profile/MediaTimelinePage.vue')
const ProfileLikeTimelinePage = () => import('@/indexApp/routes/profile/LikeTimelinePage.vue')
const ProfileEditor = () => import('@/indexApp/routes/ProfileEditor.vue')

const Setting = () => import('@/indexApp/routes/Setting.vue')
const SettingAccountSafe = () => import('@/indexApp/routes/setting/AccountSafe.vue')
const SettingAccountActivityManage = () => import('@/indexApp/routes/setting/AccountSafe/AccountActivityManage.vue')
const SettingNotifyMsg = () => import('@/indexApp/routes/setting/NotifyMsg.vue')
const SettingDataPrivacy = () => import('@/indexApp/routes/setting/DataPrivacy.vue')
const SettingBlacklistManage = () => import('@/indexApp/routes/setting/DataPrivacy/BlacklistManage.vue')
const SettingDisplayTheme = () => import('@/indexApp/routes/setting/DisplayTheme.vue')
const SettingHelpFeedback = () => import('@/indexApp/routes/setting/HelpFeedback.vue')
const SettingAbout = () => import('@/indexApp/routes/setting/About.vue')
const SettingPasskeyManage = () => import('@/indexApp/routes/setting/AccountSafe/PasskeyManage.vue')

const GlobalNotFoundPage = () => import('@/components/GlobalNotFoundPage.vue')

const routes = [
    { name: 'index', path: '/', component: Index, alias: ['/index', '/home', '/index.html'], meta: { title: '动态' } },
    { name: 'explore', path: '/explore', component: Explore, meta: { title: '探索' } },
    { name: 'bookmark', path: '/bookmark', component: Bookmark, meta: { title: '书签' } },
    { name: 'search', path: '/search', component: Search, meta: { title: '搜索' } },
    { name: 'profileEdit', path: '/profile/edit', component: ProfileEditor, meta: { title: '编辑个人资料' } },
    { name: 'replyDetail', path: '/reply/:id', component: ReplyDetail, meta: { title: '评论详情' } },
    {
        path: '/post/:id',
        component: PostDetail,
        meta: { key: 'postDetail' },
        children: [
            { name: 'postDetail', path: '', component: PostReviewListPage, meta: { key: 'postDetail', title: '帖子详情' } },
            { name: 'postLikeListPage', path: 'like', component: PostLikeListPage, meta: { key: 'postDetail' } },
            { name: 'postReviewListPage', path: 'review', component: PostReviewListPage, meta: { key: 'postDetail' } },
            { name: 'postRepostListPage', path: 'repost', component: PostRepostListPage, meta: { key: 'postDetail' } }
        ]
    },
    {
        path: '/notify',
        component: Notify,
        meta: { key: 'notify' },
        children: [
            { name: 'notify', path: '', component: NotifyAllNotifyTimePage, meta: { key: 'notify', title: '消息' } },
            { name: 'notifyAllTimelinePage', path: 'all', component: NotifyAllNotifyTimePage, meta: { key: 'notify', title: '所有消息' } },
            { name: 'notifyLikeTimelinePage', path: 'like', component: NotifyLikeNotifyTimePage, meta: { key: 'notify', title: '点赞消息' } },
            { name: 'notifyReviewTimelinePage', path: 'review', component: NotifyReviewNotifyTimePage, meta: { key: 'notify', title: '评论消息' } },
            { name: 'notifyFanNotifyTimePage', path: 'fan', component: NotifyFanNotifyTimePage, meta: { key: 'notify', title: '粉丝关注消息' } },
            { name: 'notifyRepostNotifyTimePage', path: 'repost', component: NotifyRepostNotifyTimePage, meta: { key: 'notify', title: '帖子转发消息' } },
            { name: 'notifyAtSignNotifyTimePage', path: 'atSign', component: NotifyAtSignNotifyTimePage, meta: { key: 'notify', title: '提及我消息' } },
            { name: 'notifySysNotifyTimePage', path: 'sys', component: NotifySysNotifyTimePage, meta: { key: 'notify', title: '系统消息' } }
        ]
    },
    {
        path: '/profile/:nickname',
        component: Profile,
        meta: { key: 'profile' },
        children: [
            { name: 'profile', path: '', component: ProfilePostTimelinePage, meta: { key: 'profile', title: '个人主页' } },
            { name: 'postTimelinePage', path: 'posts', component: ProfilePostTimelinePage, meta: { key: 'profile' } },
            { name: 'reviewTimelinePage', path: 'reviews', component: ProfileReviewTimelinePage, meta: { key: 'profile' } },
            { name: 'mediaTimelinePage', path: 'medias', component: ProfileMediaTimelinePage, meta: { key: 'profile' } },
            { name: 'likeTimelinePage', path: 'likes', component: ProfileLikeTimelinePage, meta: { key: 'profile' } }
        ]
    },
    {
        path: '/',
        component: Follow,
        meta: { key: 'follow' },
        children: [
            { name: 'followList', path: '/follow/:nickname', component: FollowList, meta: { key: 'follow', title: '订阅列表' } },
            { name: 'fanList', path: '/fan/:nickname', component: FanList, meta: { key: 'follow', title: '粉丝列表' } },
        ]
    },
    {
        path: '/setting',
        component: Setting,
        name: 'setting',
        meta: { key: 'setting', title: '设置' },
        children: [
            { name: 'accountSafe', path: 'account&safe', component: SettingAccountSafe, meta: { key: 'setting', title: '设置-账号与安全' } },
            { name: 'accountActivity', path: 'account&safe/activity', component: SettingAccountActivityManage, meta: { key: 'setting', parent: 'accountSafe', title: '设置-账号与安全-账户活动记录' } },
            { name: 'notifyMsg', path: 'notify&msg', component: SettingNotifyMsg, meta: { key: 'setting', title: '设置-消息通知' } },
            { name: 'dataPrivacy', path: 'data&privacy', component: SettingDataPrivacy, meta: { key: 'setting', title: '设置-数据与隐私' } },
            { name: 'blacklist', path: 'data&privacy/blacklist', component: SettingBlacklistManage, meta: { key: 'setting', parent: 'dataPrivacy', title: '设置-数据与隐私-黑名单管理' } },
            { name: 'displayTheme', path: 'display&theme', component: SettingDisplayTheme, meta: { key: 'setting', title: '设置-界面个性化设置' } },
            { name: 'helpFeedback', path: 'help&feedback', component: SettingHelpFeedback, meta: { key: 'setting', title: '设置-帮助与反馈' } },
            { name: 'about', path: 'about', component: SettingAbout, meta: { key: 'setting', meta: { title: '设置-关于' } } },
            { name: 'passkey', path: 'account&safe/passkey', component: SettingPasskeyManage, meta: { key: 'setting', parent: 'accountSafe', title: '设置-账号与安全-通行密钥' } },
        ]
    },
    { name: 'NotFound', path: '/:pathMatch(.*)*', component: GlobalNotFoundPage, meta: { title: '页面不存在' } }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.onError((e) => {
    console.error(e)
    store.setErrorMsg('无法加载页面，您可以刷新重试！')
})

export default router