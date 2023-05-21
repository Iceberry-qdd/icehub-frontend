import tooltip from './tooltip.js' // 引入指令

const directives = {
    tooltip
}

export default {
    install(app) {
        Object.keys(directives).forEach(key => app.directive(key, directives[key]))
    }
}