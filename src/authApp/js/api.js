const BASE_URL = import.meta.env.VITE_API_BASE_URL
export const REDIRECT_FLAG = 'redirect:'

/**
 * 使用传统表单登录
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
 * 调用浏览器API，生成通行密钥验证字符串
 * @param {AbortController} abortController A controller object that allows you to abort one or more DOM requests as and when desired.
 * @param {string} [mediation='optional'] A `mediation` property indicating how and whether the user should be asked to participate in
 * the operation. This controls, for example, whether the site can silently sign a user in using a stored credential.
 * @returns {Promise<Credential | null>} 密钥验证字符串
 */
export async function callWebAuthn(abortController, mediation = 'optional') {
    // To abort a WebAuthn call, instantiate an `AbortController`.
    const response = await fetchCredentialRequestOptions()
    if (!response.ok) throw new Error('创建密钥失败！')

    const result = await response.json()
    const publicKeyCredentialRequestOptions = PublicKeyCredential.parseRequestOptionsFromJSON(result)
    delete publicKeyCredentialRequestOptions.extensions.appid // XXX 当值为null时，应与无此属性效果相同，而非报错
    delete publicKeyCredentialRequestOptions.extensions.appidExclude // XXX 当值为null时，应与无此属性效果相同，而非报错

    return await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions,
        signal: abortController.signal,
        // Specify 'conditional' to activate conditional UI
        mediation: mediation
    })
}

/**
 * 使用通行密钥登录
 * @param {string} authorization token
 * @param {string} turnstileCode turnstile验证码
 * @returns 登录结果
 */
export function loginWithWebauthn(authorization, turnstileCode) {
    return fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': "application/x-www-form-urlencoded",
            'Authorization': 'Webauthn',
            'cf-turnstile-response': turnstileCode
        },
        body: new URLSearchParams({
            'authenticationResponseJSON': JSON.stringify(authorization) //convert to string
        }),
        redirect: 'follow',
        credentials: 'include'
    })
}

/**
 * 获取通行密钥验证选项
 * @returns 通行密钥验证选项
 */
export function fetchCredentialRequestOptions() {
    return fetch(`${BASE_URL}/auth/webauthn/assertion/options`, {
        method: 'POST',
        credentials: 'include',
        redirect: 'follow'
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

/**
 * 验证用户操作并跳转至原页面
 * @param {string} confirmUrl 要验证的路径
 * @param {string} password 用户密码
 * @param {string} turnstileCode turnstile验证码
 */
export function confirmAndRedirect(confirmUrl, username, password, turnstileCode) {
    // console.log(document.referrer)
    return fetch(`${BASE_URL}/auth/confirm?referrer=${confirmUrl}`, {
        method: "POST",
        headers: {
            'Content-Type': "application/x-www-form-urlencoded",
            'cf-turnstile-response': turnstileCode
        },
        body: `username=${username}&password=${password}`,
        redirect: 'follow',
        credentials: 'include'
    })
}

/**
 * 使用通行密钥进行二次验证并跳转至原页面
 * @param {string} confirmUrl 要验证的路径
 * @param {string} authorization token
 * @param {string} turnstileCode turnstile验证码
 * @returns 验证结果
 */
export function confirmAndRedirectWithWebauthn(confirmUrl, authorization, turnstileCode) {
    return fetch(`${BASE_URL}/auth/confirm?referrer=${confirmUrl}`, {
        method: 'POST',
        headers: {
            'Content-Type': "application/x-www-form-urlencoded",
            'Authorization': 'Webauthn',
            'cf-turnstile-response': turnstileCode
        },
        body: new URLSearchParams({
            'authenticationResponseJSON': JSON.stringify(authorization) //convert to string
        }),
        redirect: 'follow',
        credentials: 'include'
    })
}