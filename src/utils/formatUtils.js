export function humanizedTime(timestamps) {
    let now = new Date()
    let postTime = new Date(Number.parseInt(timestamps))

    if (postTime.getFullYear() != now.getFullYear()) {
        return `${postTime.getFullYear()}-${postTime.getMonth() + 1}-${postTime.getDate()}`
    }

    if (postTime.getMonth() != now.getMonth()) {
        return `${postTime.getMonth() + 1}月${postTime.getDate()}日`
    }

    if (postTime.getDate() != now.getDate()) {
        return `${now.getDate() - postTime.getDate()}天前`
    }

    if (postTime.getHours() != now.getHours()) {
        return `${now.getHours() - postTime.getHours()}小时前`
    }

    if (postTime.getMinutes() != now.getMinutes()) {
        return `${now.getMinutes() - postTime.getMinutes()}分钟前`
    }

    if (postTime.getSeconds() != now.getSeconds()) {
        return `${now.getSeconds() - postTime.getSeconds()}秒前`
    }
    return postTime
}

export function standardTime(timestamps) {
    const date = new Date(timestamps)
    const Y = date.getFullYear()
    const M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    const D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    const h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    const m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    return `${Y}-${M}-${D} ${h}:${m}:${s}`
}

export function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[]xy/g, function (c) {
        const r = Math.random() * 16 | 0
        const v = c == 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })
}