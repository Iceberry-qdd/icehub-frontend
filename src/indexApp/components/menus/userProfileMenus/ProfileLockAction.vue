<template>
    <div @click="handleClick">
        <span class="material-symbols-rounded max-sm:bg-gray-100 max-sm:dark:bg-neutral-700 max-sm:p-3 p-0 sm:no-hover sm:text-[1.25rem] text-[1.5rem]">
            lock_person
        </span>
        <div class="max-sm:dark:text-white/50 max-sm:text-[0.8rem] max-sm:text-zinc-500">
            {{ props.isLocked ? '设为公开账户' : '设为私密账户' }}
        </div>
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

<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<script setup>
import { inject, reactive } from 'vue'
import { updateUserProfile } from '@/indexApp/js/api.js'
import { getCurUserInfo } from '@/authApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
import ConfirmDialogBox from '@/components/ConfirmDialogBox.vue'

const { dismissProfileMenus } = inject('dismissProfileMenus')
const { newCurUser } = inject('newCurUser')
const props = defineProps({
    /** 锁定状态 */
    isLocked: {
        type: Boolean,
        required: true
    }
})
const state = reactive({
    confirmBDialogUi: {
        show: false,
        title: `确定要设为${props.isLocked ? '公开' : '私密'}账户吗？设为${props.isLocked ? '公开' : '私密'}后，他人订阅您时，${props.isLocked ? '不' : ''}需要得到您的批准`,
        confirmButton: {
            text: '确定',
            color: 'rgb(239 68 68)',
            bgColor: 'rgb(254 226 226)',
            selected: false
        },
        cancelButton: {
            text: '取消',
            color: '#000000',
            bgColor: 'rgb(243 244 246)',
            selected: false
        },
        loading: {
            show: false,
            text: '请稍后...',
            color: 'rgb(239 68 68)'
        }
    },
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
        user.confirmFollow = !props.isLocked

        const response2 = await updateUserProfile(user)
        if (!response2.ok) throw new Error((await response2.json()).message)
        const newUser = await response2.json()
        newCurUser({user: newUser})
        store.setSuccessMsg(`已设为${props.isLocked ? '私密' : '公开'}账户`)
        dismissProfileMenus()
    }catch(e){
        store.setErrorMsg(e.message)
    }finally{
        state.confirmBDialogUi.loading.show = false
        dismissConfirmDialogBox()
    }
}

function dismissConfirmDialogBox() {
    state.confirmBDialogUi.show = false
}

function handleClick(){
    state.confirmBDialogUi.show = true
}
</script>