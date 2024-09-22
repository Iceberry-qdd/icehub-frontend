import { createRouter, createWebHistory } from 'vue-router'
import { store } from '@/indexApp/js/store.js'

const Index = () => import('@/indexApp/routes/Index.vue')
const Explore = () => import('@/indexApp/routes/Explore.vue')
// const Manage = () => import('@/indexApp/routes/Manage.vue')
const Search = () => import('@/indexApp/routes/Search.vue')
const Bookmark = () => import('@/indexApp/routes/Bookmark.vue')
const PostDetail = () => import('@/indexApp/routes/PostDetail.vue')
const Profile = () => import('@/indexApp/routes/Profile.vue')
const ProfileEditor = () => import('@/indexApp/routes/ProfileEditor.vue')
const Follow = () => import('@/indexApp/routes/Follow.vue')
const FollowList = () => import('@/indexApp/routes/follow/FollowList.vue')
const FanList = () => import('@/indexApp/routes/follow/FanList.vue')
const Notify = () => import('@/indexApp/routes/Notify.vue')
const ReplyDetail = () => import('@/indexApp/routes/ReplyDetail.vue')
const Setting = () => import('@/indexApp/routes/Setting.vue')
const SettingAccountSafe = () => import('@/indexApp/routes/setting/AccountSafe.vue')
const SettingAccountActivityManage = () => import('@/indexApp/routes/setting/AccountSafe/AccountActivityManage.vue')
const SettingNotifyMsg = () => import('@/indexApp/routes/setting/NotifyMsg.vue')
const SettingDataPrivacy = () => import('@/indexApp/routes/setting/DataPrivacy.vue')
const SettingBlacklistManage = () => import('@/indexApp/routes/setting/DataPrivacy/BlacklistManage.vue')
const SettingDisplayTheme = () => import('@/indexApp/routes/setting/DisplayTheme.vue')
const SettingHelpFeedback = () => import('@/indexApp/routes/setting/HelpFeedback.vue')
const SettingAbout = () => import('@/indexApp/routes/setting/About.vue')

const GlobalNotFoundPage = () => import('@/components/GlobalNotFoundPage.vue')

const routes = [
    { name: 'index', path: '/', component: Index, alias: ['/index', '/home', '/index.html'] },
    { name: 'explore', path: '/explore', component: Explore },
    { name: 'bookmark', path: '/bookmark', component: Bookmark },
    { name: 'search', path: '/search', component: Search },
    { name: 'postDetail', path: '/post/:id', component: PostDetail },
    { name: 'profile', path: '/profile/:nickname', component: Profile },
    { name: 'profileEdit', path: '/profile/edit', component: ProfileEditor },
    { name: 'notify', path: '/notify', component: Notify },
    { name: 'replyDetail', path: '/reply/:id', component: ReplyDetail },
    {
        path: '/',
        component: Follow,
        children: [
            { name: 'followList', path: '/follow/:nickname', component: FollowList },
            { name: 'fanList', path: '/fan/:nickname', component: FanList },
        ]
    },
    {
        path: '/setting',
        component: Setting,
        name: 'setting',
        children: [
            { name: 'accountSafe', path: 'account&safe', component: SettingAccountSafe, alias: ['/setting'] },
            { name: 'accountActivity', path: 'account&safe/activity', component: SettingAccountActivityManage },
            { name: 'notifyMsg', path: 'notify&msg', component: SettingNotifyMsg },
            { name: 'dataPrivacy', path: 'data&privacy', component: SettingDataPrivacy },
            { name: 'blacklist', path: 'data&privacy/blacklist', component: SettingBlacklistManage },
            { name: 'displayTheme', path: 'display&theme', component: SettingDisplayTheme },
            { name: 'helpFeedback', path: 'help&feedback', component: SettingHelpFeedback },
            { name: 'about', path: 'about', component: SettingAbout }
        ]
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: GlobalNotFoundPage }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.onError((e) => {
    store.setErrorMsg('无法加载页面，您可以刷新重试！')
})

export default router