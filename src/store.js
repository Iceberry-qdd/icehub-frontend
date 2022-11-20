import { reactive } from 'vue'

export const store = reactive({
    GLOBAL_MSG: "",
    setMsg(msg) {
        this.GLOBAL_MSG = msg
    },
    clearMsg() {
        this.GLOBAL_MSG = ""
    },

    GLOBAL_SELECT_UID: null,
    changeSelectUid(uid) {
        this.GLOBAL_SELECT_UID = uid
    },
    clearSelectUid() {
        this.GLOBAL_SELECT_UID = null
    },

    SLIDE_DATA:{curIdx:-1,urls:[]},
    showSlide(urls,curIdx){
        this.SLIDE_DATA.urls=urls
        this.SLIDE_DATA.curIdx=curIdx
    },
    dismissSlide(){
        this.SLIDE_DATA={curIdx:-1,urls:[]}
    }
})