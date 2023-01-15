import Index from './components/bootstrap/Index.vue'
import Explore from './components/bootstrap/Explore.vue'
import Bookmark from './components/tailwind/Bookmark.vue'
import PostDetail from './components/tailwind/PostDetail.vue'
import Profile from './components/tailwind/Profile.vue'
import ProfileEdit from './components/bootstrap/ProfileEditor.vue'
import Follow from './components/tailwind/Follow.vue'
import FollowerList from './components/tailwind/FollowerList.vue'
import FollowingList from './components/tailwind/FollowingList.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { name: 'index', path: '/', component: Index, alias: ['/index', '/home'] },
    { name: 'explore', path: '/explore', component: Explore },
    { name: 'bookmark', path: '/bookmark', component: Bookmark },
    { name: 'postDetail', path: '/post/:id', component: PostDetail },
    { name: 'profile', path: '/profile/:nickname', component: Profile },
    { name: 'profileEdit', path: '/profile/edit', component: ProfileEdit },
    {
        path: '/',
        component: Follow,
        children: [
            { name: 'followerList', path: '/follower/:nickname', component: FollowerList },
            { name: 'followingList', path: '/following/:nickname', component: FollowingList },
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router