import { reactive } from 'vue'

export const authStore = reactive({
    NICKNAME: undefined,
    setNickname(nickname){
        this.NICKNAME = nickname
    },
    SYS_THEME_MODE: 'light',
    setSysThemeMode(mode) {
        this.SYS_THEME_MODE = mode
    },
})