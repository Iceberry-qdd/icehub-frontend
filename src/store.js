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

    SLIDE_DATA: { curIdx: -1, urls: [] },
    showSlide(urls, curIdx) {
        this.SLIDE_DATA.urls = urls
        this.SLIDE_DATA.curIdx = curIdx
    },
    dismissSlide() {
        this.SLIDE_DATA = { curIdx: -1, urls: [] }
    },

    SELECT_POST: {},
    setSelectPost(post) {
        this.SELECT_POST = post
    },

    SHOW_REVIEW_PANEL: false,
    showReviewPanel() {
        this.SHOW_REVIEW_PANEL = true
    },
    dismissReviewPanel() {
        this.SHOW_REVIEW_PANEL = false
    },

    SHOW_IMAGE_CROPPER: false,
    showImageCropper() {
        this.SHOW_IMAGE_CROPPER = true
    },
    dismissImageCropper() {
        this.SHOW_IMAGE_CROPPER = false
    },

    CROPPED_IMAGE: { mode: '', banner: '', avatar: '', picture: '' },
    setCroppedImageMode(mode) {
        this.CROPPED_IMAGE.mode = mode
    },
    setCroppedImageData(data) {
        this.CROPPED_IMAGE[this.CROPPED_IMAGE.mode]=data
    },

    IS_SUBMIT_PROFILE:false,
    submitProfile(){
        this.IS_SUBMIT_PROFILE=true
    }
})