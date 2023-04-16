import { createRouter, createWebHistory } from 'vue-router'

const Index = () => import('@/components/bootstrap/Index.vue')
const Explore = () => import('@/components/bootstrap/Explore.vue')
const Bookmark = () => import('@/components/tailwind/Bookmark.vue')
const PostDetail = () => import('@/components/tailwind/PostDetail.vue')
const Profile = () => import('@/components/tailwind/Profile.vue')
const ProfileEditor = () => import('@/components/bootstrap/ProfileEditor.vue')
const Follow = () => import('@/components/tailwind/Follow.vue')
const FollowerList = () => import('@/components/tailwind/FollowerList.vue')
const FollowingList = () => import('@/components/tailwind/FollowingList.vue')
const Notify = () => import('@/components/tailwind/Notify.vue')

const routes = [
    { name: 'index', path: '/', component: Index, alias: ['/index', '/home'] },
    { name: 'explore', path: '/explore', component: Explore },
    { name: 'bookmark', path: '/bookmark', component: Bookmark },
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
    { name: 'notify', path: '/notify', component: Notify }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router