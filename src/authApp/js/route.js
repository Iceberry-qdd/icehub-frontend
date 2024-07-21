import { createRouter, createWebHistory } from 'vue-router'

const Login = () => import('@/authApp/routes/Login.vue')
const Register = () => import('@/authApp/routes/Register.vue')
const QuickLogin = () => import('@/authApp/routes/QuickLogin.vue')
const GlobalNotFoundPage = () => import('@/components/GlobalNotFoundPage.vue')

const routes = [
    { name: 'login', path: '/auth/login', component: Login, alias: ['/auth.html'] },
    { name: 'register', path: '/auth/register', component: Register },
    { name: 'quickLogin', path: '/auth/quickLogin', component: QuickLogin },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: GlobalNotFoundPage }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router