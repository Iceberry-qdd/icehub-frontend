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