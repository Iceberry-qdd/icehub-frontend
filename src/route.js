import PostsTimeLine from './components/bootstrap/PostsTimeLine.vue'
import Bookmark from './components/tailwind/Bookmark.vue'
import PostDetail from './components/tailwind/PostDetail.vue'
import Profile from './components/tailwind/Profile.vue'
import ProfileEdit from './components/bootstrap/ProfileEditor.vue'
import FollowList from './components/tailwind/FollowList.vue'
import FollowerItems from './components/tailwind/FollowerItems.vue'
import FollowingItems from './components/tailwind/FollowingItems.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { path: '/', component: PostsTimeLine },
    { path: '/index', component: PostsTimeLine },
    { name: 'bookmark', path: '/bookmark', component: Bookmark },
    { name: 'postDetail', path: '/post/:id', component: PostDetail },
    { name: 'profile', path: '/profile/:nickname', component: Profile },
    { name: 'profileEdit', path: '/profile/edit', component: ProfileEdit },
    {
        name: 'followList',
        path: '/follow',
        component: FollowList,
        children: [
            { name: 'followerList', path: '/follower/:nickname', component: FollowerItems },
            { name: 'followingList', path: '/following/:nickname', component: FollowingItems },
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router