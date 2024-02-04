import { createRouter, createWebHistory } from 'vue-router'

const Index = () => import('@/components/bootstrap/Index.vue')
const Explore = () => import('@/components/bootstrap/Explore.vue')
const Manage = () => import('@/components/tailwind/Manage.vue')
const Search = () => import('@/components/tailwind/search/Search.vue')
const Bookmark = () => import('@/components/tailwind/Bookmark.vue')
const PostDetail = () => import('@/components/tailwind/PostDetail.vue')
const Profile = () => import('@/components/tailwind/Profile.vue')
const ProfileEditor = () => import('@/components/bootstrap/ProfileEditor.vue')
const Follow = () => import('@/components/tailwind/Follow.vue')
const FollowerList = () => import('@/components/tailwind/FollowerList.vue')
const FollowingList = () => import('@/components/tailwind/FollowingList.vue')
const Notify = () => import('@/components/tailwind/Notify.vue')
const ReplyDetail = () => import('@/components/tailwind/ReplyDetail.vue')
const Setting = () => import('@/components/tailwind/setting/Setting.vue')
const SettingAccountSafe = () => import('@/components/tailwind/setting/AccountSafe.vue')
const SettingNotifyMsg = () => import('@/components/tailwind/setting/NotifyMsg.vue')
const SettingDataPrivacy = () => import('@/components/tailwind/setting/DataPrivacy.vue')
const SettingDisplayTheme = () => import('@/components/tailwind/setting/DisplayTheme.vue')
const SettingHelpFeedback = () => import('@/components/tailwind/setting/HelpFeedback.vue')
const SettingAbout = () => import('@/components/tailwind/setting/About.vue')
const Global404 = () => import('@/components/tailwind/Global404.vue')

const routes = [
    { name: 'index', path: '/', component: Index, alias: ['/index', '/home'] },
    { name: 'explore', path: '/explore', component: Explore },
    { name: 'bookmark', path: '/bookmark', component: Bookmark },
    { name: 'manage', path: '/manage', component: Manage },
    { name: 'search', path: '/search', component: Search },
    { name: 'postDetail', path: '/post/:id', component: PostDetail },
    { name: 'profile', path: '/profile/:nickname', component: Profile },
    { name: 'profileEdit', path: '/profile/edit', component: ProfileEditor },
    {
        path: '/',
        component: Follow,
        children: [
            { name: 'followerList', path: '/follower/:nickname', component: FollowerList },
            { name: 'followingList', path: '/following/:nickname', component: FollowingList },
        ]
    },
    { name: 'notify', path: '/notify', component: Notify },
    { name: 'replyDetail', path: '/reply/:id', component: ReplyDetail },
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
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: Global404 }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router