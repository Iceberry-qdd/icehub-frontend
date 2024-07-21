import { reactive } from 'vue'

export const authStore = reactive({
    NICKNAME: undefined,
    setNickname(nickname){
        this.NICKNAME = nickname
    }
})