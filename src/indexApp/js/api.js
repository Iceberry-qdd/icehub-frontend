import pLimit from "p-limit"

const BASE_API_URL = import.meta.env.VITE_API_BASE_URL
const BASE_VIDEO_URL = import.meta.env.VITE_VIDEO_BASE_URL
const { fetch: _fetch } = window

window.fetch = async (...args) => {
    const [url, config] = args
    const response = await _fetch(url, { ...config, credentials: 'include', redirect: 'follow' })
    if (!response.ok && response.status === 401) {
        location = `${window.origin}/auth.html?url=${btoa(encodeURIComponent(window.location.pathname))}`
    }

    return response
}

/**
 * 拉取公共时间线上的帖子
 * @param {number} pageIndex 页数
 * @param {number} pageSize 每页条数
 * @param {number} lastTimestamp 上一页最后一条消息的时间戳
 * @returns Promise<any>
 */
export function getTimeline(pageIndex, pageSize, lastTimestamp) {
    return fetch(`${BASE_API_URL}/timeline/public?pageIndex=${pageIndex}&pageSize=${pageSize}&t=${lastTimestamp}`, {
        method: 'GET'
    })
}

/**
 * 拉取用户时间线上的帖子
 * @param {number} pageIndex 页数
 * @param {number} pageSize 每页条数
 * @param {number} lastTimestamp 上一页最后一条消息的时间戳
 * @returns Promise<any>
 */
export function getUserTimeline(pageIndex, pageSize, lastTimestamp) {
    return fetch(`${BASE_API_URL}/timeline?pageIndex=${pageIndex}&pageSize=${pageSize}&t=${lastTimestamp}`, {
        method: 'GET'
    })
}

/**
 * 上传图片
 * @param {object[] | object} files 待上传图片数组
 * @param {((this: XMLHttpRequest, ev: ProgressEvent<EventTarget>) => any) | null} onprogress 进度回调函数
 * @returns Promise<any>
 */
export function uploadImages(files, onprogress) {
    let formData = new FormData()
    const _files = new Array(...[[], files]).flat()
    _files.forEach(file => formData.append('files', file, file.name))

    const xhr = new XMLHttpRequest()
    return new Promise((resolve, reject) => {
        xhr.withCredentials = true
        xhr.upload.onprogress = onprogress
        xhr.open('POST', `${BASE_API_URL}/object/image/upload`, true)
        xhr.onload = function (e) {
            resolve(
                new Response(xhr.response, {
                    status: xhr.status,
                    statusText: xhr.statusText,
                    headers: headerToJson(xhr.getAllResponseHeaders())
                })
            )
        }
        xhr.onerror = function (e) {
            reject(
                new Response(xhr.response, {
                    status: xhr.status,
                    statusText: xhr.statusText,
                    headers: headerToJson(xhr.getAllResponseHeaders())
                })
            )
        }
        xhr.send(formData)
    })
}

/**
 * 将原始headers字符串转换成json字符串
 * @param {string} headers 原始headers字符串
 * @returns header数组[[key1, value1], [key2, value2]...]
 */
function headerToJson(headers) {
    const pattern = /(?<key>[^:]+): (?<value>[^:]+)/
    return headers.split("\r\n")
        .filter(it => it.trim().length > 0 && pattern.test(it))
        .map(it => {
            const { key, value } = pattern.exec(it).groups
            return [key, value]
        }
        )
}

/**
 * 发布帖子
 * @param {string} data 帖子内容
 * @returns Promise<any>
 */
export function posting(data) {
    return fetch(`${BASE_API_URL}/post`, {
        method: 'POST',
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(data)
    })
}

/**
 * 发布定时帖子
 * @param {string} data 帖子内容
 * @returns Promise<any>
 */
export function postingPlan(data) {
    return fetch(`${BASE_API_URL}/post/plan`, {
        method: 'POST',
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(data)
    })
}

/**
 * 对帖子点赞
 * @param {string} postId 待点赞帖子id
 * @returns 点赞结果
 */
export function likeAPost(postId) {
    return fetch(`${BASE_API_URL}/post/like/${postId}`, {
        method: 'POST',
    })
}

/**
 * 对帖子取消点赞
 * @param {string} postId 待取消点赞帖子id
 * @returns 取消点赞结果
 */
export function dislikeAPost(postId) {
    return fetch(`${BASE_API_URL}/post/like/${postId}`, {
        method: 'DELETE'
    })
}

/**
 * 根据id获取用户信息
 * @param {string} id 待查询用户id
 * @returns 用户信息
 */
export function getUserInfoById(id) {
    return fetch(`${BASE_API_URL}/user?i=${id}`, {
        method: 'GET'
    })
}

/**
 * 根据昵称获取用户信息
 * @param {string} nickname 待查询用户昵称
 * @returns 用户信息
 */
export function getUserInfoByNickname(nickname) {
    return fetch(`${BASE_API_URL}/user?i=${nickname}`, {
        method: 'GET'
    })
}

/**
 * 根据帖子id查询帖子信息
 * @param {string} id 帖子id
 * @returns 帖子信息
 */
export function getPostById(id) {
    return fetch(`${BASE_API_URL}/post/${id}`, {
        method: 'GET'
    })
}

/**
 * 根据帖子id获取评论信息
 * @param {string} postId 帖子id
 * @param {string} pageIndex 评论页数
 * @param {number} lastTimestamp 上一页最后一条消息的时间戳
 * @param {string} pageSize 评论每页条数
 * @param {string} sortBy 排序依据字段
 * @param {string} direction 排序方向
 * @returns 该帖子的评论信息
 */
export function getPostReviews(postId, pageIndex, pageSize, lastTimestamp, sortBy, direction) {
    return fetch(`${BASE_API_URL}/review?pid=${postId}&pageIndex=${pageIndex}&pageSize=${pageSize}&t=${lastTimestamp}&sortBy=${sortBy}&direction=${direction}`, {
        method: 'GET'
    })
}

/**
 * 根据用户id获取评论信息
 * @param {string} userId 用户id
 * @param {string} pageIndex 评论页数
 * @param {number} lastTimestamp 上一页最后一条消息的时间戳
 * @param {string} pageSize 评论每页条数
 * @param {string} sortBy 排序依据字段
 * @param {string} direction 排序方向
 * @returns 该用户的评论信息
 */
export function getUserReviews(userId, pageIndex, pageSize, lastTimestamp, sortBy, direction) {
    return fetch(`${BASE_API_URL}/review?uid=${userId}&pageIndex=${pageIndex}&pageSize=${pageSize}&t=${lastTimestamp}&sortBy=${sortBy}&direction=${direction}`, {
        method: 'GET'
    })
}

/**
 * 发布评论
 * @param {string} data 待发布评论内容
 * @returns 发布结果
 */
export function reviewing(data) {
    return fetch(`${BASE_API_URL}/review`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
}

/**
 * 根据id查询评论详情
 * @param {string} id 评论id
 * @returns 查询到的评论详情
 */
export function getReviewById(id) {
    return fetch(`${BASE_API_URL}/review/${id}`, {
        method: 'GET'
    })
}

/**
 * 
 * @param {string} id 评论id
 * @param {string} pageIndex 评论页数
 * @param {string} pageSize 评论每页条数
 * @param {number} lastTimestamp 上一页最后一条消息的时间戳
 * @returns 该帖子的子评论
 */
export function getSubReviewById(id, pageIndex, pageSize, lastTimestamp) {
    return fetch(`${BASE_API_URL}/review?rid=${id}&pageIndex=${pageIndex}&pageSize=${pageSize}&t=${lastTimestamp}`, {
        method: 'GET'
    })
}

/**
 * 对评论点赞
 * @param {string} reviewId 待评论帖子id
 * @returns 点赞结果
 */
export function likeAReview(reviewId) {
    return fetch(`${BASE_API_URL}/review/like/${reviewId}`, {
        method: 'PUT'
    })
}

/**
 * 对评论取消点赞
 * @param {string} postId 待取消点赞评论id
 * @returns 取消点赞结果
 */
export function dislikeAReview(reviewId) {
    return fetch(`${BASE_API_URL}/review/like/${reviewId}`, {
        method: 'DELETE'
    })
}

/**
 * 根据用户id返回用户帖子信息
 * @param {string} uid 用户id
 * @param {string} pageIndex 当前页码
 * @param {string} pageSize 每页数量
 * @param {number} lastTimestamp 上一页最后一条消息的时间戳
 * @returns 用户的帖子信息
 */
export function getUserPosts(uid, pageIndex, pageSize, lastTimestamp) {
    return fetch(`${BASE_API_URL}/post?uid=${uid}&pageIndex=${pageIndex}&pageSize=${pageSize}&t=${lastTimestamp}`, {
        method: 'GET'
    })
}

/**
 * 修改用户信息
 * @param {object} user 待修改user实体类
 * @returns 修改后的user信息
 */
export function updateUserProfile(user) {
    return fetch(`${BASE_API_URL}/user`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
}

/**
 * 根据用户昵称判断用户是否存在
 * @param {string} nickname 用户昵称
 * @returns 用户是否存在
 */
export function isUserExists(nickname) {
    return fetch(`${BASE_API_URL}/user?n=${nickname}`, {
        method: 'HEAD'
    })
}

/**
 * 关注用户
 * @param {string} userId 待关注用户id
 * @returns 关注结果，成功或失败
 */
export function followUser(userId) {
    return fetch(`${BASE_API_URL}/user/following/${userId}`, {
        method: 'PUT'
    })
}

/**
 * 取消关注用户
 * @param {string} userId 待取消关注用户id
 * @returns 取消关注结果，成功或失败
 */
export function unFollowUser(userId) {
    return fetch(`${BASE_API_URL}/user/following/${userId}`, {
        method: 'DELETE'
    })
}

/**
 * 查询用户的关注列表
 * @param {string} userId 待查询用户id
 * @param {number} pageIndex 分页页码
 * @param {number} pageSize 分页页大小
 * @param {number} lastTimestamp 上一页最后一条消息的时间戳
 * @returns 关注者列表
 */
export function getFollowList(userId, pageIndex, pageSize, lastTimestamp) {
    return fetch(`${BASE_API_URL}/user/following/list?fid=${userId}&pageIndex=${pageIndex}&pageSize=${pageSize}&t=${lastTimestamp}`, {
        method: 'GET'
    })
}

/**
 * 查询用户的粉丝列表
 * @param {string} userId 待查询用户id
 * @param {number} pageIndex 分页页码
 * @param {number} pageSize 分页页大小
 * @param {number} lastTimestamp 上一页最后一条消息的时间戳
 * @returns 关注用户列表
 */
export function getFanList(userId, pageIndex, pageSize, lastTimestamp) {
    return fetch(`${BASE_API_URL}/user/follower/list?uid=${userId}&pageIndex=${pageIndex}&pageSize=${pageSize}&t=${lastTimestamp}`, {
        method: 'GET'
    })
}

/**
 * mark一篇帖子
 * @param {string} postId 帖子id
 * @returns mark结果
 */
export function markAPost(postId) {
    return fetch(`${BASE_API_URL}/post/mark/${postId}`, {
        method: 'POST'
    })
}

/**
 * unMark一篇帖子
 * @param {string} postId 帖子id
 * @returns unMark结果
 */
export function unMarkAPost(postId) {
    return fetch(`${BASE_API_URL}/post/mark/${postId}`, {
        method: 'DELETE'
    })
}

/**
 * 查询用户mark帖子列表
 * @param {number} pageIndex 当前页码
 * @param {number} pageSize 每页大小
 * @param {number} lastTimestamp 上一页最后一条消息的时间戳
 * @returns 返回用户mark帖子列表
 */
export function getMarkPostList(pageIndex, pageSize, lastTimestamp) {
    return fetch(`${BASE_API_URL}/post/mark/list?pageIndex=${pageIndex}&pageSize=${pageSize}&t=${lastTimestamp}`, {
        method: 'GET'
    })
}

/**
 * 更改帖子内容
 * @param {object} post 新的post对象
 * @return 返回新的帖子对象
 */
export function updatePost(post) {
    return fetch(`${BASE_API_URL}/post/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(post)
    })
}

/**
 * 查询给定图片的原图链接，忽略hidden警告
 * @param {string} id type的id
 * @param {number} imageId 图片id，即该图片所在的数组的下标
 * @param {String} type 何种类型的id, post | review
 * @returns 该图片的原始链接
 */
export function getImageUrlIgnoreHidden(id, imageId, type = 'post') {
    return fetch(`${BASE_API_URL}/${type}/image?id=${id}&attrId=${imageId}&ih=true`, {
        method: 'GET'
    })
}

/**
 * 分页查询给定用户的消息列表
 * @param {number} pageIndex 分页页码
 * @param {number} pageSize 分页页大小
 * @param {number} lastTimestamp 上一页最后一条消息的时间戳
 * @param {Array<String>} types 要获取的消息类型，可包含多个，以数组形式提供，不传即代表获取所有类型的消息
 * @returns 该用户的消息列表
 */
export function getUsersNotifyList(pageIndex, pageSize, lastTimestamp, types = []) {
    const type = !types || types.length === 0 ? '' : `&${types.map(it => `type=${it}`).join('&')}`
    return fetch(`${BASE_API_URL}/notify?pageIndex=${pageIndex}&pageSize=${pageSize}&t=${lastTimestamp}${type}`, {
        method: 'GET'
    })
}

/**
 * 批量设置消息为已读状态
 * @param {List<string>} notifyIds 待设为已读的消息id
 * @returns 设置为已读的结果
 */
export function markNotifiesRead(notifyIds) {
    return fetch(`${BASE_API_URL}/notify/read/multiple`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(notifyIds)
    })
}

/**
 * 设置消息状态为已读
 * @param {string} notifyId 待设为已读的消息id
 * @returns 设置为已读的结果
 */
export function markNotifyRead(notifyId) {
    return fetch(`${BASE_API_URL}/notify/read/${notifyId}`, {
        method: 'POST'
    })
}

/**
 * 查询当前用户消息统计项
 * @returns 用户帖子统计值
 */
export function queryCurUserNotifyStatistic() {
    return fetch(`${BASE_API_URL}/notify/stat`, {
        method: 'GET'
    })
}

/**
 * 删除一篇帖子
 * @param {PostVO} postVO 待删除帖子
 */
export function deleteOnePost(postVO) {
    return fetch(`${BASE_API_URL}/post/${postVO.id}`, {
        method: 'DELETE'
    })
}

/**
 * 创建黑名单
 * @param {string} type 黑名单类型
 * @param {string} contentId 内容id
 * @param {string} curUserId 当前登录用户id
 */
export function createOneBlacklist(type, contentId, curUserId) {
    const blacklist = {
        type: type,
        contentId: contentId,
        userId: curUserId
    }
    return fetch(`${BASE_API_URL}/blacklist`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(blacklist)
    })
}

/**
 * 修改帖子的可见属性
 * @param {object} post 待修改的帖子
 * @param {string} oldVisibility 帖子原先的visibility
 * @returns 新的帖子对象
 */
export function modifyPostVisibility(post, oldVisibility) {
    const requestBody = {
        id: post.id,
        oldVisibility: oldVisibility,
        newVisibility: post.status
    }

    return fetch(`${BASE_API_URL}/post/visibility`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
}

/**
 * 删除黑名单
 * @param {string} type 黑名单类型
 * @param {string} contentId 内容id
 * @param {string} curUserId 当前登录用户id
 */
export function deleteOneBlacklist(type, contentId, curUserId) {
    const blacklist = {
        type: type,
        contentId: contentId,
        userId: curUserId
    }
    return fetch(`${BASE_API_URL}/blacklist`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(blacklist)
    })
}

/**
 * 将当前用户所有未读通知标记为已读
 * @param {Array<String>} types 要已读的消息类型，不传表示已读全部
 * @returns 标记的数量
 */
export function markAllNotifyReadByTypes(types = undefined) {
    return fetch(`${BASE_API_URL}/notify/read/all`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(types)
    })
}

/**
 * 切换帖子是否允许评论
 * @param {object} param0 请求体，包含reviewId和allowReview的值
 * @returns 关闭评论结果
 */
export function toggleCloseReviewApi({ id, allowReview }) {
    const requestBody = {
        id: id,
        oldAllowReview: allowReview,
        newAllowReview: !allowReview
    }
    return fetch(`${BASE_API_URL}/post/allowReview`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
}

/**
 * 全局搜索联想接口
 * @param {string} word 待搜索关键词
 * @param {Array<number>} timeRange 搜索范围，起止时间戳
 * @param {Array<string>} type 搜索范围，搜索类型 
 * @param {Array<string>} userId 搜索范围， 搜索特定用户，不传则搜索所有用户
 * @returns 搜索结果
 */
export function globalSearchSuggest(word, type = ['USER', 'POST', 'REVIEW'], timeRange = [0, Date.now()], userId = []) {
    const requestBody = {
        key: word,
        timeRange: timeRange,
        type: type,
        userId: userId,
        pageSize: 10,
        pageIndex: 0
    }
    return fetch(`${BASE_API_URL}/search/suggest`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
}

/**
 * 全局联搜索接口
 * @param {string} word 待搜索关键词
 * @param {number} pageSize 每页大小
 * @param {number} pageIndex 当前页码
 * @param {Array<string>} type 搜索范围，搜索类型 
 * @param {Array<number>} timeRange 搜索范围，起止时间戳
 * @param {Array<string>} userId 搜索范围， 搜索特定用户，不传则搜索所有用户
 * @returns 搜索结果
 */
export function globalSearch(word, pageSize, pageIndex, type = ['USER', 'POST', 'REVIEW'], timeRange = [0, Date.now()], userId = []) {
    const requestBody = {
        key: word,
        timeRange: timeRange,
        type: type,
        userId: userId,
        pageSize: pageSize,
        pageIndex: pageIndex
    }
    return fetch(`${BASE_API_URL}/search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
}

/**
 * 获取热搜榜数据
 * @param {Number} count 热搜榜条数，取值范围[1-20]
 * @returns 获取到的热搜榜条数
 */
export function getHotSearch(count) {
    return fetch(`${BASE_API_URL}/search/hot?n=${count}`, {
        method: 'GET'
    })
}

/**
 * 退出登录
 */
export function logout() {
    return fetch(`${BASE_API_URL}/auth/logout`, {
        method: 'POST'
    })
}

/**
 * 根据id删除评论
 * @param {String} id 评论id
 * @returns 删除结果，true | false
 */
export function deleteOneReview(id) {
    return fetch(`${BASE_API_URL}/review/${id}`, {
        method: 'DELETE'
    })
}

/**
 * 切换帖子的置顶状态
 * @param {string} id 帖子id
 * @param {boolean} oldPin 原来状态
 * @param {boolean} newPin 新状态
 * @returns 切换置顶结果
 */
export function togglePin(id, oldPin, newPin) {
    const requestBody = {
        id: id,
        oldPin: oldPin,
        newPin: newPin
    }
    return fetch(`${BASE_API_URL}/post/pin`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
}

/**
 * 移除粉丝
 * @param {String} fanId 粉丝id
 * @returns 移除结果， true-移除成功
 */
export function removeFan(fanId) {
    return fetch(`${BASE_API_URL}/user/follower/${fanId}`, {
        method: 'DELETE'
    })
}

/**
 * 通过粉丝的关注请求
 * @param {String} fanId 粉丝id
 */
export function confirmFanRequest(fanId) {
    return fetch(`${BASE_API_URL}/user/follower/confirm/${fanId}`, {
        method: 'POST'
    })
}

/**
 * 根据帖子id，分页获取点赞此帖子的用户列表
 * @param {string} postId 帖子id
 * @param {number} pageIndex 当前页码
 * @param {number} pageSize 每页大小
 * @param {number} lastTimestamp 上一页最后一条消息的时间戳
 * @returns 用户分页对象
 */
export function getLikeListOfPost(postId, pageIndex, pageSize, lastTimestamp) {
    return fetch(`${BASE_API_URL}/user/like?pid=${postId}&pageIndex=${pageIndex}&pageSize=${pageSize}&t=${lastTimestamp}`, {
        method: 'GET'
    })
}

/**
 * 根据帖子id，分页获取转发此帖子的用户列表
 * @param {string} postId 帖子id
 * @param {number} pageIndex 当前页码
 * @param {number} pageSize 每页大小
 * @param {number} lastTimestamp 上一页最后一条消息的时间戳
 * @returns 用户分页对象
 */
export function getRepostListOfPost(postId, pageIndex, pageSize, lastTimestamp) {
    return fetch(`${BASE_API_URL}/repost/${postId}?pageIndex=${pageIndex}&pageSize=${pageSize}&t=${lastTimestamp}`, {
        method: 'GET'
    })
}

/**
 * 根据用户id，分页获取该用户在帖子中包含的媒体文件
 * @param {string} userId 用户id
 * @param {number} pageIndex 当前页码
 * @param {number} pageSize 每页大小
 * @param {number} lastTimestamp 上一页最后一条消息的时间戳
 * @param {String} from 媒体来源，POST | REVIEW
 * @returns 媒体分页对象
 */
export function getMediasOfUser(userId, pageIndex, pageSize, lastTimestamp, from) {
    return fetch(`${BASE_API_URL}/object/user/${userId}?pageIndex=${pageIndex}&pageSize=${pageSize}&t=${lastTimestamp}`, {
        method: 'GET'
    })
}

/**
 * 根据用户id，分页获取该用户点赞过的帖子
 * @param {string} postId 用户id
 * @param {number} pageIndex 当前页码
 * @param {number} pageSize 每页大小
 * @param {number} lastTimestamp 上一页最后一条消息的时间戳
 * @returns 帖子分页对象
 */
export function getLikePostsOfUser(userId, pageIndex, pageSize, lastTimestamp) {
    return fetch(`${BASE_API_URL}/post/like?uid=${userId}&pageIndex=${pageIndex}&pageSize=${pageSize}&t=${lastTimestamp}`, {
        method: 'GET'
    })
}

/**
 * 获取当前登录用户的黑名单列表
 * @param {string} type 黑名单的类型，支持USER、POST、REVIEW
 * @param {number} pageIndex 当前页码
 * @param {number} pageSize 每页大小
 * @param {number} lastTimestamp 上一页最后一条消息的时间戳
 * @returns 获取到的黑名单列表
 */
export function getBlacklist(type, pageIndex, pageSize, lastTimestamp) {
    return fetch(`${BASE_API_URL}/blacklist/list?pageIndex=${pageIndex}&pageSize=${pageSize}&t=${lastTimestamp}&type=${type}`, {
        method: 'GET'
    })
}

/**
 * 将当前登录用户的黑名单列表按类型全部清空
 * @param {string} type 黑名单的类型，支持USER、POST、REVIEW
 * @returns 移除的条数
 */
export function deleteAllBlacklistByType(type) {
    return fetch(`${BASE_API_URL}/blacklist/batch?type=${type}`, {
        method: 'DELETE'
    })
}

/**
 * 分页获取当前用户的活动记录
 * @param {number} pageIndex 当前页码
 * @param {number} pageSize 每页大小
 * @param {number} lastTimestamp 上一页最后一条消息的时间戳
 * @returns 
 */
export function getActivities(pageIndex, pageSize, lastTimestamp) {
    return fetch(`${BASE_API_URL}/user/activity?pageIndex=${pageIndex}&pageSize=${pageSize}&t=${lastTimestamp}`, {
        method: 'GET'
    })
}

/**
 * 上传视频
 * @param {File} file 待上传视频
 * @param {string} hash 文件hash值，请求头中携带
 * @param {number} startLoc 若是分片文件，则表示分片文件在原始文件中的起始偏移
 * @param {number} endLoc 若是分片文件，则表示分片文件在原始文件中的最终偏移
 * @param {((this: XMLHttpRequest, ev: ProgressEvent<EventTarget>) => any) | null} onprogress 进度回调函数
 * @returns {Promise<void>}
 */
async function uploadVideo(file, hash, startLoc = 0, endLoc = 0, onprogress) {
    // 获取文件上传链接
    const contentType = 'video/*'
    let response = await getUploadPresignedUrl(contentType)
    if (!response.ok) return response

    const result = await response.text()
    const url = URL.parse(`${BASE_VIDEO_URL}${result}`)
    const id = url.searchParams.get('x-amz-meta-Id')

    // 上传文件
    const xhr = new XMLHttpRequest()
    const requestBody = new Blob([file], { type: contentType })
    return new Promise((resolve, reject) => {
        xhr.withCredentials = true
        xhr.upload.onprogress = onprogress
        xhr.open('PUT', url, true)
        xhr.onload = function (e) {
            resolve(
                new Response(JSON.stringify({ id: id, hash: hash }), {
                    status: xhr.status,
                    statusText: xhr.statusText,
                    headers: headerToJson(xhr.getAllResponseHeaders())
                })
            )
        }
        xhr.onerror = function (e) {
            reject(
                new Response(JSON.stringify({ id: id, hash: hash, startLoc: startLoc, endLoc: endLoc }), {
                    status: 408, // 返回请求超时表示上传失败
                    statusText: 'Request Timeout',
                    headers: headerToJson(xhr.getAllResponseHeaders())
                })
            )
        }
        xhr.send(requestBody)
    })
}


const CHUNK_SIZE = 1024 * 1024 * 10
const MAX_RETRY_COUNT = 3

/**
 * 分片上传视频文件后合并
 * @param {File} file 待上传完整文件
 * @param {Array<{id: string, hash: string, startLoc: number, endLoc: number, uploaded: boolean}>} chunkInfoList 所有分片的列表。其中有一属性uploaded，标识该分片是否已上传成功，用于用户手动重试时过滤
 * @param {(loaded: number, total: number) => void} onprogress 进度回调函数
 * @returns {Promise<Response>} 上传后完整文件的id
 */
export async function splitAndUploadVideo(file, chunkInfoList = [], onprogress) {
    // 将需要上传的文件分片放入任务队列
    const taskList = new Array()

    // 传入空数组时，表示为首次上传状态，先初始化
    if (chunkInfoList.length === 0) {
        for (let startByte = 0; startByte < file.size; startByte += CHUNK_SIZE) {
            chunkInfoList.push({
                id: undefined,
                hash: undefined,
                startLoc: startByte,
                endLoc: Math.min(startByte + CHUNK_SIZE, file.size),
                uploaded: false
            })
        }
    }

    // 根据chunkInfoList初始化taskList
    for (const it of chunkInfoList) {
        if (it.uploaded) continue // 跳过已上传成功的分片

        const chunk = file.slice(it.startLoc, it.startLoc + CHUNK_SIZE)
        const hash = await calcHash(chunk)
        if (!it.hash) it.hash = hash // hash为空表示未初始化，此时更新hash

        if (it.hash !== hash) { // 重试时，可能会不一致
            return new Promise((_, reject) => {
                reject(
                    new Response(JSON.stringify({ message: `文件hash值不一致！[${it.startLoc, it.endLoc}]` }), {
                        status: 400,
                        statusText: 'Bad Request'
                    })
                )
            })
        }

        taskList.push({
            chunk: chunk, // 分片文件
            hash: hash, // 分片文件hash
            id: undefined, // 当前分片的id(文件名)，上传完成后赋值
            startLoc: it.startLoc, // 分片在源文件的起始位置
            endLoc: it.endLoc // 分片在源文件的结束位置
        })
    }

    // 并发分片上传
    const limit = pLimit(3) // 并发数为3
    let loaded = chunkInfoList.filter(it => it.uploaded)
        .map(it => it.endLoc - it.startLoc + 1)
        .reduce((pre, cur) => pre + cur, 0) // 已上传字节数
    let curTotal = loaded // 应上传总字节数

    const promiseQueue = taskList.map(it => {
        return limit(() => reTry(uploadVideo(it.chunk, it.hash, it.startLoc, it.endLoc, (e) => {
            if (e.lengthComputable) {
                curTotal += it.chunk.size
                loaded += loaded < curTotal ? e.loaded : 0 // 超过文件总字节数就不再加，网络传输和文件实际大小不相同
                onprogress(loaded, Math.max(file.size, curTotal))
            }
        })), MAX_RETRY_COUNT)
    })

    let hasFailedChunk = false // 是否有上传失败的分片
    const resList = await Promise.allSettled(promiseQueue)

    for (const res of resList) {
        if (res.status === 'fulfilled') {
            const response = await res.value
            if(!response.ok) return new Promise(reject => {
                reject(
                    new Response(JSON.stringify(chunkInfoList), {
                        status: 408, // 返回请求超时表示上传失败
                        statusText: 'Request Timeout'
                    })
                )
            })

            const { id, hash } = await response.json()
            const chunkInfo = chunkInfoList.filter(it => it.hash === hash).at(0)
            chunkInfo.uploaded = true
            chunkInfo.id = id
        } else {
            hasFailedChunk = true
        }
    }

    if (hasFailedChunk) {
        return new Promise(reject => {
            reject(
                new Response(JSON.stringify(chunkInfoList), {
                    status: 408, // 返回请求超时表示上传失败
                    statusText: 'Request Timeout'
                })
            )
        })
    }

    // 合并文件，返回文件id
    return composeChunks(
        chunkInfoList.map(it => { return { objectName: it.id, Etag: it.hash } }),
        file.type
    )
}

/**
 * 获取视频上传链接
 * @param {string} contentType 视频类型
 * @returns 预先签过名的上传链接
 */
function getUploadPresignedUrl(contentType) {
    return fetch(`${BASE_API_URL}/object/video/upload`, {
        method: 'GET',
        headers: {
            'X-Content-Type': contentType
        }
    })
}

/**
 * 合并分片文件
 * @param {Array} chunkList 分片信息列表
 * @param {string} contentType 文件mimeType
 * @returns {Promise<Response>} 合并完成后的文件id
 */
function composeChunks(chunkList, contentType) {
    return fetch(`${BASE_API_URL}/object/video/compose`, {
        method: 'POST',
        headers: {
            'X-Content-Type': contentType,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(chunkList)
    })
}

/**
 * 计算文件md5值
 * @param {Blob} fileChunk 待计算md5值的文件
 * @returns {Promise<string>}
 */
function calcHash(fileChunk) {
    return new Promise(resolve => {
        const worker = new Worker('/hash.js')
        worker.postMessage({ fileChunk })
        worker.onmessage = function (e) {
            const { hash, progress } = e.data
            if (hash) {
                resolve(hash)
            }
        }
    })
        .catch((reason) => {
            console.error(reason)
        })
}

/**
 * 支持Promise重试
 * @param {Promise<any>} func 重试作用的异步函数
 * @param {number} retryCount 重试次数
 * @returns {Promise<any}
 */
function reTry(func, retryCount) {
    return new Promise((resolve, reject) => {
        function reTryFunc(retryCount) {
            func.then((res) => {
                resolve(res)
            }).catch((err) => {
                if (retryCount > 0) {
                    setTimeout(() => {
                        reTryFunc(retryCount - 1)
                    }, 3000)
                } else {
                    reject(err)
                }
            })
        }
        reTryFunc(retryCount)
    })
}