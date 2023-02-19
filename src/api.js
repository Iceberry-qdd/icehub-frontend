const BASE_URL = "http://localhost:8080"
const TOKEN = localStorage.getItem('TOKEN')

/**
 * 拉取公共时间线上的帖子
 * @param {int} pageIndex 页数
 * @param {int} pageSize 每页条数
 * @returns Promise<any>
 */
export function getTimeline(pageIndex, pageSize) {
    return fetch(`${BASE_URL}/timeline/public?pageIndex=${pageIndex}&pageSize=${pageSize}`, {
        method: 'GET',
        headers: {
            'Authorization': TOKEN,
        },
        redirect: 'follow',
        credentials: 'same-origin'
    })
}

/**
 * 拉取用户时间线上的帖子
 * @param {int} pageIndex 页数
 * @param {int} pageSize 每页条数
 * @returns Promise<any>
 */
export function getUserTimeline(pageIndex, pageSize) {
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
 * 上传图片
 * @param {object[]} files 待上传图片数组
 * @param {array} filesInfo 图片数组描述信息
 * @returns Promise<any>
 */
export function uploadImages(files, filesInfo) {
    return new Promise((resolve, reject) => {
        let formData = new FormData()
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i], files[i].name)
        }

        const filesInfoStr = JSON.stringify(filesInfo)

        formData.append('filesInfo', new Blob([filesInfoStr], { type: 'application/json' }))

        const xhr = new XMLHttpRequest()
        xhr.withCredentials = true;
        xhr.open('POST', `${BASE_URL}/object/upload/image`, true)
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

/**
 * 对帖子点赞
 * @param {string} postId 待点赞帖子id
 * @returns 点赞结果
 */
export function likeAPost(postId) {
    return fetch(`${BASE_URL}/post/like/${postId}`, {
        method: 'POST',
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
            'nickname': nickname,
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

/**
 * 根据昵称获取用户信息
 * @param {string} nickname 待查询用户昵称
 * @returns 用户信息
 */
export function getUserInfoByNickname(nickname) {
    return fetch(`${BASE_URL}/user/${nickname}`, {
        method: 'GET',
        headers: {
            'Authorization': TOKEN,
        },
        redirect: 'follow',
        credentials: 'same-origin'
    })
}

/**
 * 根据帖子id查询帖子信息
 * @param {string} id 帖子id
 * @returns 帖子信息
 */
export function getPostById(id) {
    return fetch(`${BASE_URL}/post?pid=${id}`, {
        method: 'GET',
        headers: {
            'Authorization': TOKEN,
        },
        redirect: 'follow',
        credentials: 'same-origin'
    })
}

/**
 * 根据帖子id获取评论信息
 * @param {string} postId 帖子id
 * @param {string} pageIndex 评论页数
 * @param {string} pageSize 评论每页条数
 * @returns 该帖子的评论信息
 */
export function getPostReviews(postId, pageIndex, pageSize) {
    return fetch(`${BASE_URL}/review?pid=${postId}&pageIndex=${pageIndex}&pageSize=${pageSize}`, {
        method: 'GET',
        headers: {
            'Authorization': TOKEN,
        },
        redirect: 'follow',
        credentials: 'same-origin'
    })
}

/**
 * 发布评论
 * @param {string} data 待发布评论内容
 * @returns 发布结果
 */
export function reviewing(data) {
    return fetch(`${BASE_URL}/review`, {
        method: 'POST',
        headers: {
            'Authorization': TOKEN,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        redirect: 'follow',
        credentials: 'same-origin'
    })
}

/**
 * 根据id查询评论详情
 * @param {string} id 评论id
 * @returns 查询到的评论详情
 */
export function getReviewById(id) {
    return fetch(`${BASE_URL}/review/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': TOKEN
        },
        redirect: 'follow',
        credentials: 'same-origin'
    })
}

/**
 * 
 * @param {string} id 评论id
 * @param {string} pageIndex 评论页数
 * @param {string} pageSize 评论每页条数
 * @returns 该帖子的子评论
 */
export function getSubReviewById(id, pageIndex, pageSize) {
    return fetch(`${BASE_URL}/review?rid=${id}&pageIndex=${pageIndex}&pageSize=${pageSize}`, {
        method: 'GET',
        headers: {
            'Authorization': TOKEN,
        },
        redirect: 'follow',
        credentials: 'same-origin'
    })
}

/**
 * 对评论点赞
 * @param {string} reviewId 待评论帖子id
 * @returns 点赞结果
 */
export function likeAReview(reviewId) {
    return fetch(`${BASE_URL}/review/like/${reviewId}`, {
        method: 'PUT',
        headers: {
            'Authorization': TOKEN,
        },
        redirect: 'follow',
        credentials: 'same-origin'
    })
}

/**
 * 对评论取消点赞
 * @param {string} postId 待取消点赞评论id
 * @returns 取消点赞结果
 */
export function dislikeAReview(reviewId) {
    return fetch(`${BASE_URL}/review/like/${reviewId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': TOKEN,
        },
        redirect: 'follow',
        credentials: 'same-origin'
    })
}

/**
 * 根据用户id返回用户帖子信息
 * @param {string} uid 用户id
 * @param {string} pageIndex 当前页码
 * @param {string} pageSize 每页数量
 * @returns 用户的帖子信息
 */
export function getUserPosts(uid, pageIndex, pageSize) {
    return fetch(`${BASE_URL}/post?uid=${uid}`, {
        method: 'POST',
        headers: {
            'Authorization': TOKEN,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'pageIndex': pageIndex,
            'pageSize': pageSize
        }),
        redirect: 'follow',
        credentials: 'same-origin'
    })
}

/**
 * 上传用户banner图
 * @param {string} data 以base64编码的图片数据
 * @returns 用户的新banner图信息
 */
export function uploadUserBanner(data) {
    let formData = new FormData()
    const fileInfo = JSON.stringify({ hidden: false, altText: '', contentType: '' })
    const image = JSON.stringify(data)
    formData.append('file', new Blob([image], { type: 'application/json' }))
    formData.append('fileInfo', new Blob([fileInfo], { type: 'application/json' }))
    return fetch(`${BASE_URL}/object/upload/image/banner`, {
        method: 'POST',
        headers: {
            'Authorization': TOKEN
        },
        body: formData,
        redirect: 'follow',
        credentials: 'same-origin'
    })
}

/**
 * 上传用户avatar图
 * @param {string} data 以base64编码的图片数据
 * @returns 用户的新avatar图信息
 */
export function uploadUserAvatar(data) {
    let formData = new FormData()
    const fileInfo = JSON.stringify({ hidden: false, altText: '', contentType: '' })
    const image = JSON.stringify(data)
    formData.append('file', new Blob([image], { type: 'application/json' }))
    formData.append('fileInfo', new Blob([fileInfo], { type: 'application/json' }))
    return fetch(`${BASE_URL}/object/upload/image/avatar`, {
        method: 'POST',
        headers: {
            'Authorization': TOKEN
        },
        body: formData,
        redirect: 'follow',
        credentials: 'same-origin'
    })
}

/**
 * 修改用户信息
 * @param {object} user 待修改user实体类
 * @returns 修改后的user信息
 */
export function updateUserProfile(user) {
    return fetch(`${BASE_URL}/user`, {
        method: 'PUT',
        headers: {
            'Authorization': TOKEN,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user),
        redirect: 'follow',
        credentials: 'same-origin'
    })
}

/**
 * 根据用户昵称判断用户是否存在
 * @param {string} nickname 用户昵称
 * @returns 用户是否存在
 */
export function isUserExists(nickname) {
    return fetch(`${BASE_URL}/user?n=${nickname}`, {
        method: 'GET',
        headers: {
            'Authorization': TOKEN
        },
        redirect: 'follow',
        credentials: 'same-origin'
    })
}

/**
 * 关注用户
 * @param {string} userId 待关注用户id
 * @returns 关注结果，成功或失败
 */
export function followUser(userId) {
    return fetch(`${BASE_URL}/user/follow/${userId}`, {
        method: 'PUT',
        headers: {
            'Authorization': TOKEN
        },
        redirect: 'follow',
        credentials: 'same-origin'
    })
}

/**
 * 取消关注用户
 * @param {string} userId 待取消关注用户id
 * @returns 取消关注结果，成功或失败
 */
export function unFollowUser(userId) {
    return fetch(`${BASE_URL}/user/follow/${userId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': TOKEN
        },
        redirect: 'follow',
        credentials: 'same-origin'
    })
}

/**
 * 查询用户关注者列表
 * @param {string} userId 待查询用户id
 * @param {int} pageIndex 分页页码
 * @param {int} pageSize 分页页大小
 * @returns 关注者列表
 */
export function getFollowerList(userId, pageIndex, pageSize) {
    return fetch(`${BASE_URL}/user/follow/list?uid=${userId}`, {
        method: 'POST',
        headers: {
            'Authorization': TOKEN,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'pageIndex': pageIndex,
            'pageSize': pageSize
        }),
        redirect: 'follow',
        credentials: 'same-origin'
    })
}

/**
 * 查询用户关注用户列表
 * @param {string} userId 待查询用户id
 * @param {int} pageIndex 分页页码
 * @param {int} pageSize 分页页大小
 * @returns 关注用户列表
 */
export function getFollowingList(userId, pageIndex, pageSize) {
    return fetch(`${BASE_URL}/user/follow/list?fid=${userId}`, {
        method: 'POST',
        headers: {
            'Authorization': TOKEN,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'pageIndex': pageIndex,
            'pageSize': pageSize
        }),
        redirect: 'follow',
        credentials: 'same-origin'
    })
}

/**
 * mark一篇帖子
 * @param {string} postId 帖子id
 * @returns mark结果
 */
export function markAPost(postId) {
    return fetch(`${BASE_URL}/post/mark/${postId}`, {
        method: 'POST',
        headers: {
            'Authorization': TOKEN
        },
        redirect: 'follow',
        credentials: 'same-origin'
    })
}

/**
 * unMark一篇帖子
 * @param {string} postId 帖子id
 * @returns unMark结果
 */
export function unMarkAPost(postId) {
    return fetch(`${BASE_URL}/post/mark/${postId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': TOKEN
        },
        redirect: 'follow',
        credentials: 'same-origin'  
    })
}

/**
 * 查询用户mark帖子列表
 * @param {int} pageIndex 当前页码
 * @param {int} pageSize 每页大小
 * @returns 返回用户mark帖子列表
 */
export function getMarkPostList(pageIndex, pageSize) {
    return fetch(`${BASE_URL}/post/mark/list?pageIndex=${pageIndex}&pageSize=${pageSize}`, {
        method: 'GET',
        headers: {
            'Authorization': TOKEN
        },
        redirect: 'follow',
        credentials: 'same-origin'
    })
}