import { createRouter, createWebHistory } from 'vue-router'

const Login = () => import('@/authApp/routes/Login.vue')
const Register = () => import('@/authApp/routes/Register.vue')
const Confirm = () => import('@/authApp/routes/Confirm.vue')
const GlobalNotFoundPage = () => import('@/components/GlobalNotFoundPage.vue')

const routes = [
    { name: 'login', path: '/auth/login', component: Login },
    { name: 'register', path: '/auth/register', component: Register },
    { name: 'confirm', path: '/auth/confirm', component: Confirm },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: GlobalNotFoundPage }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router