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
        this.CROPPED_IMAGE[this.CROPPED_IMAGE.mode] = data
    },
    setCroppedImage(mode, data) {
        this.CROPPED_IMAGE.mode = mode
        this.CROPPED_IMAGE[this.CROPPED_IMAGE.mode] = data
    },
    clearCroppedImage() {
        this.CROPPED_IMAGE = { mode: '', banner: '', avatar: '', picture: '' }
    },

    IS_SUBMIT_PROFILE: false,
    submitProfile() {
        this.IS_SUBMIT_PROFILE = true
    },

    IS_SUBMIT: false,
    submit() {
        this.IS_SUBMIT = true
    },

    SELECT_USER: null,
    setSelectUser(user) {
        this.SELECT_USER = user
    },
    clearSelectUser() {
        this.SELECT_USER = null
    },

    REPOST_POST: null,
    repost(post) {
        this.REPOST_POST = post
    },
    clearRepost() {
        this.REPOST_POST = null
    },

    GLOBAL_NOTIFY_BANNER_MSG: '',
    setGlobalNotifyBannerMsg(msg) {
        this.GLOBAL_NOTIFY_BANNER_MSG = msg
    },
    clearGlobalNotifyBannerMsg() {
        this.GLOBAL_NOTIFY_BANNER_MSG = ''
    },

    REVIEW_PANEL_DATA: null,
    setReviewPanelData(review) {
        this.REVIEW_PANEL_DATA = review
    },
    clearReviewPanel() {
        this.REVIEW_PANEL_DATA = null
    },

    MOBILE_MODE: false,
    setMobileMode(isMobile) {
        this.MOBILE_MODE = isMobile
    },

    PAD_MODE: false,
    setPadMode(isPad) {
        this.PAD_MODE = isPad
    },

    PWA_MODE: false,
    setPwaMode(isPwa) {
        this.PWA_MODE = isPwa
    },

    SYS_THEME_MODE: 'light',
    setSysThemeMode(mode) {
        this.SYS_THEME_MODE = mode
    },

    NOTIFY_STATISTIC: [],
    setNotifyStatistic(statistic) {
        this.NOTIFY_STATISTIC = statistic
    },
    incrNotifyUnreadCountByType({ type, delta }) {
        this.NOTIFY_STATISTIC.find(it => it?.type === type).unreadCount += delta
    },
    setAllNotifyRead() {
        this.NOTIFY_STATISTIC.forEach(it => it.unreadCount = 0)
    },
    setAllNotifyReadByTypes(types = []) {
        if (!types || types.length == 0) {
            this.setAllNotifyRead()
            return
        }
        this.NOTIFY_STATISTIC.filter(it => types.includes(it.type)).forEach(it => it.unreadCount = 0)
    },
    AVATAR_STYLE: 'rounded',
    setAvatarStyle(style) {
        this.AVATAR_STYLE = style
    }
})