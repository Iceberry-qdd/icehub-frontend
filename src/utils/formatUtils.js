export function humanizedTime(timestamps) {
    const now = new Date()
    const postTime = new Date(Number.parseInt(timestamps))
    const [timeDiff, suffix] = now < postTime ? [postTime - now,'后'] : [now - postTime,'前']

    const oneSecond = 1000
    const oneMinute = oneSecond * 60
    const oneHour = oneMinute * 60
    const oneDay = oneHour * 24
    const oneWeek = oneDay * 7
    const oneMonth = oneDay * 30
    const oneYear = oneMonth * 24

    if (timeDiff < oneMinute) {
        return `${Number.parseInt(timeDiff / oneSecond)}秒${suffix}`
    }

    if (timeDiff < oneHour) {
        return `${Number.parseInt(timeDiff / oneMinute)}分钟${suffix}`
    }

    if (timeDiff < oneDay) {
        return `${Number.parseInt(timeDiff / oneHour)}小时${suffix}`
    }

    if (timeDiff < oneWeek) {
        return `${Number.parseInt(timeDiff / oneDay)}天${suffix}`
    }

    if (timeDiff < oneMonth) {
        return `${Number.parseInt(timeDiff / oneWeek)}周${suffix}`
    }

    if (timeDiff < oneYear) {
        return `${Number.parseInt(timeDiff / oneMonth)}月${suffix}`
    }

    if (timeDiff > oneYear) {
        return `${Number.parseInt(timeDiff - oneYear)}年${suffix}`
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

/**
 * 返回一段时间范围，范围从[start, start + step.unit]
 * @param {Date} start 日期范围开始
 * @param {number} step 增加的步长
 * @param {string} unit 增加的单位
 */
export function getDateTimeRange(start, step, unit){
    let end = new Date(start)
    switch (unit) {
        case 'YEAR':
            end.setFullYear(start.getFullYear() + step)
            break
        case 'MONTH':
            end.setMonth(start.getMonth() + step)
            break
        case 'DAY':
            end.setDate(start.getDate() + step)
            break
        case 'HOUR':
            end.setHours(start.getHours() + step)
            break
        case 'MINUTE':
            end.setMinutes(start.getMinutes() + step)
            break
        case 'SECOND':
            end.setSeconds(start.setSeconds() + step)
            break
        default:
            throw new Error(`Unspported time unit: ${unit}`)
    }
    return [start, end]
}