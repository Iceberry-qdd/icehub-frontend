import PostEditor from './components/tailwind/PostEditor.vue';
import PostsTimeLine from './components/bootstrap/PostsTimeLine.vue'
import Bookmark from './components/tailwind/Bookmark.vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { createApp } from 'vue'
import App from './App.vue'


const routes = [
    { path: '/', component: PostsTimeLine },
    { path: '/bookmark', component: Bookmark },
    // {path:'/auth','auth.html'}
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router