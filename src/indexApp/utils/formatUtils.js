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
export function standardDateTime(timestamps) {
    const date = new Date(timestamps)
    return intlDateTimeFormat.format(date)
}

const dateFormatOptions = {
    localeMatcher: 'best fit',
    dateStyle: 'medium',
}
const intlDateFormat = new Intl.DateTimeFormat(undefined, dateFormatOptions)
export function standardDate(timestamps) {
    const date = new Date(timestamps)
    return intlDateFormat.format(date)
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

const intlTextSegmenter = new Intl.Segmenter(undefined, { granularity: 'word', localeMatcher: 'best fit' })
/**
 * 使用segmenter取子字符串，结果包含preTag、postTag，长度计数时，不包含preTag、postTag
 * @param {number} maxLen 最大字符串长度，必须为非负整数
 * @param {number} offset 从第几个字符开始取，必须为非负整数
 * @returns {string} 子字符串
 */
export function substringBySegmenter(text, maxLen, offset) {
    maxLen = Math.min(text.length, Math.max(maxLen ?? text.length, 0))
    offset = Math.min(Math.max(offset ?? 0, 0), maxLen)
    const segArr = [...intlTextSegmenter.segment(text.substring(offset))]
    let [result, index, lastResultLen] = ['', 0, 0]
    const [preTag, postTag] = ['<em>', '</em>']

    while (maxLen > 0 && index < segArr.length) {
        const seg = segArr.at(index).segment
        result += seg
        maxLen -= seg.length
        index++

        if (result.includes(preTag, lastResultLen)) {
            maxLen += preTag.length
            lastResultLen = result.length
        }
        if (result.includes(postTag, lastResultLen)) {
            maxLen += postTag.length
            lastResultLen = result.length
        }
    }

    return result
}

/**
 * 判断一个obj对象的具体类型
 * @param {Object} obj object对象
 * @param {Type} type 预测其类型
 */
export function isType(obj, type) {
    return Object.prototype.toString.call(obj) === `[object ${type.name}]`
}

/**
 * 将时间戳或Date返回为`Input[type=datetime-local]`组件支持的`YYYY-MM-DDThh:mm`格式
 * @param {number} timestamp 13位毫秒级时间戳 | 10位秒级时间戳数字 | Date
 */
export function toDtPickerFormat(timestamp) {
    const date = new Date(timestamp)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getDate()).padStart(2, '0')}`
}

/**
 * 将时间戳或Date返回为`Input[type=date]`组件支持的`YYYY-MM-DD`格式
 * @param {number} timestamp 13位毫秒级时间戳 | 10位秒级时间戳数字 | Date
 */
export function toDatePickerFormat(timestamp) {
    const date = new Date(timestamp)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

/**
 * 将时间戳或Date返回为`Input[type=time]`组件支持的`hh:mm`格式
 * @param {number} timestamp 13位毫秒级时间戳 | 10位秒级时间戳数字 | Date
 */
export function toTimePickerFormat(timestamp) {
    const date = new Date(timestamp)
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getDate()).padStart(2, '0')}`
}