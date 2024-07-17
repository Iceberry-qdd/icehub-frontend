<template>
    <div @click="handleClick">
        <span class="material-symbols-rounded max-sm:bg-gray-100 max-sm:p-3 p-0 sm:no-hover sm:text-[1.25rem] text-[1.5rem]">bookmark</span>
        <div class="max-sm:text-[0.8rem] max-sm:text-zinc-500">书签</div>
    </div>
</template>

<script setup>
import { inject, reactive } from 'vue'
import { useRouter } from 'vue-router'

const { dismissProfileMenus } = inject('dismissProfileMenus')
const router = useRouter()
const state = reactive({
    curUser: JSON.parse(localStorage.getItem("CUR_USER"))
})

function handleClick(){
    router.push({name: 'bookmark'})
    dismissProfileMenus()
}
</script>