import { reactive } from 'vue'

export const store = reactive({
    GLOBAL_MSG: [],
    setInfoMsg(msg) {
        this.GLOBAL_MSG.unshift({ id: Date.now(), type: 'info', msg: msg })
    },
    setSuccessMsg(msg) {
        this.GLOBAL_MSG.unshift({ id: Date.now(), type: 'success', msg: msg })
    },
    setWarningMsg(msg) {
        this.GLOBAL_MSG.push({ id: Date.now(), type: 'warning', msg: msg })
    },
    setErrorMsg(msg) {
        this.GLOBAL_MSG.push({ id: Date.now(), type: 'error', msg: msg })
    },
    dismissMsg(messageId) {
        const message = this.GLOBAL_MSG.find(it => it.id == messageId)
        if (!message) return

        const index = this.GLOBAL_MSG.indexOf(message)
        this.GLOBAL_MSG.splice(index, 1)
    }
})