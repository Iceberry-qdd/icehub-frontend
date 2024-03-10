<template>
    <div
        class="flex flex-rows gap-x-3 items-center justify-start"
        @click="handleClick">
        <span class="material-icons-round no-hover p-0 text-[1.2rem]">create</span>
        <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
        <div class="btn-no-select">更改资料</div>
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