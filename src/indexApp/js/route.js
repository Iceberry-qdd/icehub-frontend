import { createRouter, createWebHistory } from 'vue-router'

const Index = () => import('@/indexApp/routes/Index.vue')
const Explore = () => import('@/indexApp/routes/Explore.vue')
const Manage = () => import('@/indexApp/routes/Manage.vue')
const Search = () => import('@/indexApp/routes/Search.vue')
const Bookmark = () => import('@/indexApp/routes/Bookmark.vue')
const PostDetail = () => import('@/indexApp/routes/PostDetail.vue')
const Profile = () => import('@/indexApp/routes/Profile.vue')
const ProfileEditor = () => import('@/indexApp/routes/ProfileEditor.vue')
const Follow = () => import('@/indexApp/routes/Follow.vue')
const FollowerList = () => import('@/indexApp/routes/follow/FollowerList.vue')
const FollowingList = () => import('@/indexApp/routes/follow/FollowingList.vue')
const Notify = () => import('@/indexApp/routes/Notify.vue')
const ReplyDetail = () => import('@/indexApp/routes/ReplyDetail.vue')
const Setting = () => import('@/indexApp/routes/Setting.vue')
const SettingAccountSafe = () => import('@/indexApp/routes/setting/AccountSafe.vue')
const SettingNotifyMsg = () => import('@/indexApp/routes/setting/NotifyMsg.vue')
const SettingDataPrivacy = () => import('@/indexApp/routes/setting/DataPrivacy.vue')
const SettingDisplayTheme = () => import('@/indexApp/routes/setting/DisplayTheme.vue')
const SettingHelpFeedback = () => import('@/indexApp/routes/setting/HelpFeedback.vue')
const SettingAbout = () => import('@/indexApp/routes/setting/About.vue')
const GlobalNotFoundPage = () => import('@/components/GlobalNotFoundPage.vue')

const routes = [
    { name: 'index', path: '/', component: Index, alias: ['/index', '/home'] },
    { name: 'explore', path: '/explore', component: Explore },
    { name: 'bookmark', path: '/bookmark', component: Bookmark },
    { name: 'manage', path: '/manage', component: Manage },
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
            { name: 'followerList', path: '/follower/:nickname', component: FollowerList },
            { name: 'followingList', path: '/following/:nickname', component: FollowingList },
        ]
    },
    {
        path: '/',
        component: Setting,
        name: 'setting',
        children: [
            { name: 'accountSafe', path: '/setting/account&safe', component: SettingAccountSafe, alias: ['/setting'] },
            { name: 'notifyMsg', path: '/setting/notify&msg', component: SettingNotifyMsg },
            { name: 'dataPrivacy', path: '/setting/data&privacy', component: SettingDataPrivacy },
            { name: 'displayTheme', path: '/setting/display&theme', component: SettingDisplayTheme },
            { name: 'helpFeedback', path: '/setting/help&feedback', component: SettingHelpFeedback },
            { name: 'about', path: '/setting/about', component: SettingAbout }
        ]
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: GlobalNotFoundPage }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router