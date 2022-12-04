import PostsTimeLine from './components/bootstrap/PostsTimeLine.vue'
import Bookmark from './components/tailwind/Bookmark.vue'
import PostDetail from './components/tailwind/PostDetail.vue'
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'


const routes = [
    { path: '/', component: PostsTimeLine },
    { path: '/index', component: PostsTimeLine },
    { name: 'bookmark', path: '/bookmark', component: Bookmark },
    { name: 'postDetail', path: '/post/:id', component: PostDetail }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router