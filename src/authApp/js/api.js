const BASE_URL = import.meta.env.VITE_API_BASE_URL

/**
 * 用户登录
 * @param {string} authorization token
 * @param {string} turnstileCode turnstile验证码
 * @returns 登录结果
 */
export function login(authorization, turnstileCode) {
    return fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            'Content-Type': "application/x-www-form-urlencoded",
            'cf-turnstile-response': turnstileCode
        },
        body: `username=${authorization.username}&password=${authorization.password}`,
        redirect: 'follow',
        credentials: 'include'
    })
}

/**
 * 用户注册
 * @param {string} nickname 用户名
 * @param {string} password 密码
 * @param {string} avatarUrl 头像路径
 * @param {string} turnstileCode turnstile验证码
 * @returns 注册结果
 */
export function register(nickname, password, avatarUrl, turnstileCode) {
    return fetch(`${BASE_URL}/auth/register`, {
        method: 'PUT',
        headers: {
            'Content-Type': "application/json",
            'cf-turnstile-response': turnstileCode
        },
        body: JSON.stringify({
            'nickname': nickname,
            'password': password,
            'avatarUrl': avatarUrl
        }),
        redirect: 'follow',
        credentials: 'include'

    })
}

/**
 * 获取当前用户信息
 * @returns 当前用户信息
 */
export function getCurUserInfo() {
    return fetch(`${BASE_URL}/curUser`, {
        method: 'GET',
        redirect: 'follow',
        credentials: 'include'
    })
}