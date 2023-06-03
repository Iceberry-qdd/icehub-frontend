export function humanizedTime(timestamps) {
    const now = new Date()
    const postTime = new Date(Number.parseInt(timestamps))
    const timeDiff = now - postTime

    const oneSecond = 1000
    const oneMinute = oneSecond * 60
    const oneHour = oneMinute * 60
    const oneDay = oneHour * 24
    const oneWeek = oneDay * 7
    const oneMonth = oneDay * 30
    const oneYear = oneMonth * 24

    if (timeDiff < oneMinute) {
        return `${Number.parseInt(timeDiff / oneSecond)}秒前`
    }

    if (timeDiff < oneHour) {
        return `${Number.parseInt(timeDiff / oneMinute)}分钟前`
    }

    if (timeDiff < oneDay) {
        return `${Number.parseInt(timeDiff / oneHour)}小时前`
    }

    if (timeDiff < oneWeek) {
        return `${Number.parseInt(timeDiff / oneDay)}天前`
    }

    if (timeDiff < oneMonth) {
        return `${Number.parseInt(timeDiff / oneWeek)}周前`
    }

    if (timeDiff < oneYear) {
        return `${Number.parseInt(timeDiff / oneMonth)}月前`
    }

    if (timeDiff > oneYear) {
        return `${Number.parseInt(timeDiff - oneYear)}年前`
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

export function calcBgColor(string) {
    return '#' + (string.charCodeAt(0).toString(16)).padEnd(6, '0')
}