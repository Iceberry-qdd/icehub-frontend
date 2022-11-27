const BASE_URL = "http://localhost:8080"
const TOKEN = localStorage.getItem('TOKEN')

/**
 * 拉取时间线上的帖子
 * @param {int} pageIndex 页码
 * @param {int} pageSize 页数
 * @returns Promise<any>
 */
export function getTimeline(pageIndex, pageSize) {
    return fetch(`${BASE_URL}/timeline?pageIndex=${pageIndex}&pageSize=${pageSize}`, {
        method: 'GET',
        headers: {
            'Authorization': TOKEN,
        },
        redirect: 'follow',
        credentials: 'same-origin'
    })
}

/**
 * 上传文件
 * @param {object[]} files 待上传文件数组
 * @returns Promise<any>
 */
export function uploadFiles(files) {
    return new Promise((resolve, reject) => {
        let formData = new FormData()
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i], files[i].name)
        }

        const xhr = new XMLHttpRequest()
        xhr.withCredentials = true;
        xhr.open('POST', `${BASE_URL}/object/upload`, true)
        xhr.setRequestHeader('Authorization', TOKEN)
        xhr.onload = function () {
            if (xhr.status === 201) resolve(xhr.response)
            else reject(Error(xhr.response.error))
        }
        xhr.onerror = function () {
            reject(Error(xhr.response.error))
        }
        xhr.onprogress = function (e) {
            if (e.lengthComputable) {
                var percent = Math.ceil((e.loaded / e.total) * 100)
                // progress(percent)
                console.log(percent)
            }
        }

        xhr.send(formData)
    })
}

/**
 * 发布帖子
 * @param {string} data 帖子内容
 * @returns Promise<any>
 */
export function posting(data) {
    return fetch(`${BASE_URL}/post`, {
        method: 'POST',
        headers: {
            'Authorization': TOKEN,
            'Content-Type': "application/json"
        },
        body: JSON.stringify(data),
        redirect: 'follow',
        credentials: 'same-origin'
    })
}

// /**
//  * 获取图片真实Url
//  * @param {string} url 编码后Url
//  * @returns 解码后Url
//  */
// export function getImgRealUrl(url){
//     return fetch(`${BASE_URL}/object/preview/${url}`,{
//         method:'Get',
//         headers:{
//             token:TOKEN,
//         },
//         redirect:'follow',
//         credentials:'same-origin'
//     })
// }

/**
 * 对帖子点赞
 * @param {string} postId 待点赞帖子id
 * @returns 点赞结果
 */
export function likeAPost(postId) {
    return fetch(`${BASE_URL}/post/like/${postId}`, {
        method: 'PUT',
        headers: {
            'Authorization': TOKEN,
        },
        redirect: 'follow',
        credentials: 'same-origin'
    })
}

/**
 * 对帖子取消点赞
 * @param {string} postId 待取消点赞帖子id
 * @returns 取消点赞结果
 */
export function dislikeAPost(postId) {
    return fetch(`${BASE_URL}/post/like/${postId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': TOKEN,
        },
        redirect: 'follow',
        credentials: 'same-origin'
    })
}

/**
 * 用户登录
 * @param {string} nickname 用户名
 * @param {string} password 密码
 * @returns 登录结果
 */
export function login(nickname, password) {
    return fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        body: JSON.stringify({
            'username': nickname,
            'password': password
        }),
        headers: {
            'Content-Type': "application/json"
        },
        redirect: 'follow',
        credentials: 'same-origin'
    })
}

/**
 * 获取公钥
 * @returns 公钥
 */
export function getPublicKey() {
    return fetch(`${BASE_URL}/auth/publicKey`, {
        method: 'GET',
        redirect: 'follow',
        credentials: 'same-origin'
    })
}

/**
 * 用户注册
 * @param {string} nickname 用户名
 * @param {string} password 密码
 * @param {string} avatarUrl 头像路径
 * @returns 注册结果
 */
export function register(nickname, password, avatarUrl) {
    return fetch(`${BASE_URL}/auth/register`, {
        method: 'PUT',
        body: JSON.stringify({
            'nickname': nickname,
            'password': password,
            'avatarUrl': avatarUrl
        }),
        headers: {
            'Content-Type': "application/json"
        },
        redirect: 'follow',
        credentials: 'same-origin'

    })
}

/**
 * 获取当前用户信息
 * @returns 当前用户信息
 */
export function getCurUserInfo() {
    return fetch(`${BASE_URL}/curUser`, {
        method: 'GET',
        headers: {
            'Authorization': TOKEN,
        },
        redirect: 'follow',
        credentials: 'same-origin'
    })
}

/**
 * 根据id获取用户信息
 * @param {string} id 待查询用户id
 * @returns 用户信息
 */
export function getUserInfoById(id) {
    return fetch(`${BASE_URL}/user/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': TOKEN,
        },
        redirect: 'follow',
        credentials: 'same-origin'
    })
}