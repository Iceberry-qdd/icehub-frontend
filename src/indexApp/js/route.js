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