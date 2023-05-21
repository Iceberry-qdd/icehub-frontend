export default function (el, binding) {
    if (binding.value == undefined) return
    const tipWords = binding.value.replace(/\\n/g, ''.replace(/\\r/g, ''))
    if (tipWords.trim().length == 0) return
    var timeoutId = null
    el.onmouseover = function (ev) {
        const oEvent = ev || event
        const oFrom = oEvent.fromElement || oEvent.relatedTarget
        if (!this.contains(oFrom)) {
            // console.log('鼠标移入')
            timeoutId = setTimeout(() => { el.appendChild(element) }, 5000);
        }
    }

    el.onmouseout = function (ev) {
        var oEvent = ev || event
        var oTo = oEvent.toElement || oEvent.relatedTarget
        if (!this.contains(oTo)) {
            // console.log('鼠标移出')
            // console.log(timeoutId)
            clearTimeout(timeoutId)
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
        padding: 0.25rem 0.25rem;
        translate: 0 ${translateY}%;
        word-break: break-all;
        max-width: 12rem;
        z-index: 100;
        text-align-last: center;
    `

    const element = instantTemplate(template, style)
    element.style.minWidth = calcWidth(element)

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