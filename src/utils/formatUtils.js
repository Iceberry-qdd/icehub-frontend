export function humanizedTime(timestamps) {
    const now = new Date()
    const postTime = new Date(Number.parseInt(timestamps))
    const [timeDiff, suffix] = now < postTime ? [postTime - now, '后'] : [now - postTime, '前']

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

const dateTimeFormatOptions = {
    localeMatcher: 'best fit',
    dateStyle: 'medium',
    timeStyle: 'medium',
    hour12: false
}
const intlDateTimeFormat = new Intl.DateTimeFormat(undefined, dateTimeFormatOptions)
export function standardTime(timestamps) {
    const date = new Date(timestamps)
    return intlDateTimeFormat.format(date)
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
export function getDateTimeRange(start, step, unit) {
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

const numberFormatOptions = {
    localeMatcher: 'best fit',
    notation: "compact",
    maximumFractionDigits: 1,
    compactDisplay: "short",
    roundingMode: "floor"
}
const intlNumberFormat = new Intl.NumberFormat(undefined, numberFormatOptions)
export function humanizedNumber(number) {
    return intlNumberFormat.format(number)
}