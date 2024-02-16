import { calcBgColor } from "@/indexApp/utils/formatUtils.js"

const origin = window.location.origin
export const atSignExt = {
    type: 'lang',
    filter: function (text, converter, options) {
        text = text.replace(/@[^@\s]+/gm, function (match, content) {
            const name = match.replaceAll('@', '')
            const bgColor = calcBgColor(name)
            const link =`${origin}/profile/${name}`
            return `<a href="${link}" style="text-decoration:none;">
                        <AtSign href="${link}" name="${name}" style="background-color:${bgColor};">@${name}</AtSign>
                    </a>`
        })
        return text
    }
}