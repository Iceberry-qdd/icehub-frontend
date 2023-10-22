/**
 * 
 * @param {HTMLElement} el 切入元素
 * @param {any} binding 
 * @returns 
 */
export default function (el, binding) {
    if (binding.value == undefined) return
    const tipWords = binding.value.replace(/\\n/g, ''.replace(/\\r/g, ''))
    if (tipWords.trim().length == 0) return

    el.onmouseover = function (ev) {
        const oEvent = ev || event
        const oFrom = oEvent.fromElement || oEvent.relatedTarget
        if (!this.contains(oFrom)) {

            const tooltips = []
            for (let i = 0; i < el.children.length; i++) {
                if (el.children.item(i).classList.contains('m-tooltip')) {
                    tooltips.push(el.children.item(i))
                }
            }

            tooltips.forEach(it => { el.removeChild(it) })
            el.appendChild(element)
        }
    }

    el.onmouseout = function (ev) {
        var oEvent = ev || event
        var oTo = oEvent.toElement || oEvent.relatedTarget
        if (!this.contains(oTo)) {
            try { el.removeChild(element) } catch (e) { }
        }
    }

    const template = `<div class="m-tooltip">${tipWords}</div>`
    let translateY = 0
    switch (binding.arg) {
        case 'quarter':
            translateY = 25
            break;
        case 'full':
            translateY = 110
            break;
        default:
            translateY = 50
            break;
    }
    const style = `
        position: absolute;
        background-color: #000000AA;
        color: white;
        font-size: 11pt;
        border-radius: 5px;
        padding: 25%;
        translate: 0 ${translateY}%;
        word-break: break-all;
        max-width: 12rem;
        z-index: 100;
        text-align-last: center;
    `

    const element = instantTemplate(template, style)
    // element.style.minWidth = calcWidth(element)

    el.style.position = 'relative'
}

function instantTemplate(template, style) {
    let div = document.createElement('div')
    div.innerHTML = template
    div = div.childNodes[0]
    div.setAttribute('style', style)
    return div
}

function calcWidth(element) {
    document.documentElement.append(element)
    const width = element.offsetWidth
    document.documentElement.removeChild(element)
    return Math.max(width, 48) + 2 + 'px'
}