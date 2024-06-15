<template>
    <div @click="handleClick">
        <span class="material-icons-round max-sm:bg-gray-100 max-sm:p-3 p-0 sm:no-hover sm:text-[1.25rem] text-[1.5rem]">create</span>
        <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
        <div class="max-sm:text-[0.8rem] max-sm:text-zinc-500">更改资料</div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { inject } from 'vue'
const { dismissProfileMenus } = inject('dismissProfileMenus')

const router = useRouter()

async function handleClick() {
    await router.push('/profile/edit')
    dismissProfileMenus()
}
</script>