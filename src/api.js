const BASE_URL = "http://localhost:8080"
const TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJhdWQiOiJiMDcyZTI4My05MjRlLTRhM2YtYjM2Mi0yYjQ1NzcwNDFlMDkiLCJpc3MiOiJwYW5ib28iLCJleHAiOjE2Njk1MTk5MTEsImlhdCI6MTY2ODkxNTExMSwidXNlcm5hbWUiOiJVc2VyMSJ9.us8FReyxldoGZ-06pVOiMOJLAetwvE5Li_N4c5EnZj7zTEbtL-MIEdBRWGomqEmUa9ub1zdzkO-rgD_1wGobHg"

/**
 * 拉取时间线上的帖子
 * @param {int} pageIndex 页码
 * @param {int} pageSize 页数
 * @returns Promise<any>
 */
export function getTimeline(pageIndex, pageSize) {
    return fetch(`${BASE_URL}/timeline?pageIndex=${pageIndex}&pageSize=${pageSize}`, {
        method: 'Get',
        headers: {
            "token": TOKEN,
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
        xhr.open('Post', `${BASE_URL}/object/upload`, true)
        xhr.setRequestHeader("token", TOKEN)
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
        method: 'Post',
        headers: {
            "token": TOKEN,
            'Content-Type': "application/json"
        },
        body: JSON.stringify(data),
        redirect: 'follow',
        credentials: 'same-origin'
    })
}

/**
 * 获取图片真实Url
 * @param {string} url 编码后Url
 * @returns 解码后Url
 */
export function getImgRealUrl(url){
    return fetch(`${BASE_URL}/object/preview/${url}`,{
        method:'Get',
        headers:{
            token:TOKEN,
        },
        redirect:'follow',
        credentials:'same-origin'
    })
}