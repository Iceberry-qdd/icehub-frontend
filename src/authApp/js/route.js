import { createRouter, createWebHistory } from 'vue-router'

const Login = () => import('@/authApp/routes/Login.vue')
const Register = () => import('@/authApp/routes/Register.vue')
const Confirm = () => import('@/authApp/routes/Confirm.vue')
const GlobalNotFoundPage = () => import('@/components/GlobalNotFoundPage.vue')

const routes = [
    { name: 'login', path: '/auth/login', component: Login, meta: {title: '登录'} },
    { name: 'register', path: '/auth/register', component: Register, meta: {title: '注册'} },
    { name: 'confirm', path: '/auth/confirm', component: Confirm, meta: {title: '请验证您的身份'} },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: GlobalNotFoundPage, meta: {title: '页面不存在'} }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router