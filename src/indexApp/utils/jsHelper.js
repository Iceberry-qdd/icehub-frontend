/**
 * 防抖函数
 * @param {Function} func 待执行函数
 * @param {Number} wait 等待时间(ms)
 */
export const debounce = (func, wait) => {
    let timeout
    return function () {
        if (timeout) clearTimeout(timeout)

        timeout = setTimeout(() => {
            func.call(this, ...arguments)
        }, wait)
    }
}