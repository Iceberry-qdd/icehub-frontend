<template>
    <div
        class="cursor-default flex flex-row hover:bg-helper items-center justify-between max-sm:px-3 px-4 py-2">
        <div>
            <p>设为私密账号</p>
            <p class="text-[0.85rem] text-neutral-400">
                {{ info }}
            </p>
        </div>
        <ToggleButton
            id="profile-lock-checkbox"
            :enabled="props.enabled"
            :checked="props.locked"
            :loading="state.loading"
            @click="toggle">
        </ToggleButton>
        <Teleport to="#app">
            <ConfirmDialogBox
                v-if="state.confirmBDialogUi.show"
                class="fixed top-0"
                :ui="state.confirmBDialogUi"
                @choice="choose">
            </ConfirmDialogBox>
        </Teleport>
    </div>
</template>

<script setup>
import { computed, reactive, defineAsyncComponent } from 'vue'
import { store } from '@/indexApp/js/store.js'
import { getCurUserInfo } from '@/authApp/js/api.js'
import ToggleButton from '@/components/ToggleButton.vue'
import { updateUserProfile } from '@/indexApp/js/api.js'
const ConfirmDialogBox = defineAsyncComponent(() => import('@/components/ConfirmDialogBox.vue'))

const emits = defineEmits(['toggle'])
const props = defineProps({
    /** 是否启用该选项 */
    enabled: {
        type: Boolean,
        required: false,
        default: true,
    },
    /** 是否开启锁定 */
    locked: {
        type: Boolean,
        required: true
    }
})

const confirmDialogTitle = computed(() => {
    return `设为${props.locked ? '公开' : '私密'}账户？设为${props.locked ? '公开' : '私密'}后，他人订阅您时，${props.locked ? '不' : ''}需要得到您的批准`
})

const state = reactive({
    confirmBDialogUi: {
        show: false,
        title: confirmDialogTitle,
        confirmButton: {
            selected: false
        },
        cancelButton: {
            selected: false
        },
        loading: {
            show: false
        }
    },
    loading: false
})


function choose(args) {
    const choice = args.choice
    if (choice === 'confirm') {
        doToggleLockProfile()
    } else {
        dismissConfirmDialogBox()
    }
}

async function doToggleLockProfile(){
    try{
        state.confirmBDialogUi.loading.show = true
        const response = await getCurUserInfo()
        if (!response.ok) throw new Error((await response.json()).message)

        const user = await response.json()
        user.confirmFollow = !props.locked

        const response2 = await updateUserProfile(user)
        if (!response2.ok) throw new Error((await response2.json()).message)
        const newUser = await response2.json()
        localStorage.setItem('CUR_USER', JSON.stringify(newUser))

        emits('toggle')
        store.setSuccessMsg(`已设为${props.locked ? '公开':  '私密'}账户`)
    }catch(e){
        store.setErrorMsg(e.message)
    }finally{
        state.confirmBDialogUi.loading.show = false
        dismissConfirmDialogBox()
    }
}

function dismissConfirmDialogBox() {
    state.confirmBDialogUi.show = false
    state.loading = false
}

const info = computed(() => {
    return '启用后，您主页中的帖子、粉丝列表等仅关注者可见。'
})

function toggle(){
    if(state.loading || !state.enabled) return

    state.confirmBDialogUi.show = true
    state.loading = true
}
</script>