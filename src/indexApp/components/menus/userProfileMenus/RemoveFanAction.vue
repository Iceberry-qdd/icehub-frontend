<template>
    <div @click="handleClick">
        <span class="material-symbols-rounded max-sm:bg-gray-100 max-sm:dark:bg-neutral-700 max-sm:p-3 p-0 sm:no-hover sm:text-[1.25rem] text-[1.5rem]">person_remove</span>
        <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
        <div class="max-sm:dark:text-white/50 max-sm:text-[0.8rem] max-sm:text-zinc-500">移除粉丝</div>
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
import { inject, reactive } from 'vue'
import { removeFan } from '@/indexApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
import ConfirmDialogBox from '@/components/ConfirmDialogBox.vue'

const { dismissProfileMenus } = inject('dismissProfileMenus')
const { removeFanOnUi } = inject('removeFanOnUi')
const props = defineProps({
    /** 要移除的粉丝id */
    fanId: {
        type: String,
        required: true
    }
})
const state = reactive({
    confirmBDialogUi: {
        show: false,
        title: '移除该粉丝？',
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
})

function choose(args) {
    const choice = args.choice
    if (choice === 'confirm') {
        doRemoveFan()
    } else {
        dismissConfirmDialogBox()
    }
}

async function doRemoveFan(){
    try{
        state.confirmBDialogUi.loading.show = true
        const response = await removeFan(props.fanId)
        if (!response.ok) throw new Error((await response.json()).message)

        const result = await response.json()
        store.setSuccessMsg('已移除订阅者')
        removeFanOnUi()
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