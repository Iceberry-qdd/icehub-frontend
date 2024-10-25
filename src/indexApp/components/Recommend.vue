<template>
    <div class="flex flex-col gap-y-4 p-4">
        <!-- eslint-disable-next-line vue/max-attributes-per-line -->
        <div v-if="showUnImpl" class="bg-primaryContainer-disable dark:bg-[#1e1e1e] p-4 rounded-[8px]">
            <!-- TODO implement it. -->
            <div class="flex flex-row items-center justify-between mb-2">
                <span class="font-bold text-[12pt]">猜你喜欢</span>
                <span class="cursor-pointer dark:text-onPrimary hover:underline hover:underline-offset-2 text-[10pt] text-primary">换一换</span>
            </div>
            <div
                v-for="user in state.users"
                :key="user.nickname"
                class="active:dark:bg-neutral-700 cursor-pointer flex flex-row gap-x-4 hover:bg-primaryContainer hover:dark:bg-neutral-800 p-2 rounded-[8px]">
                <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                <Avatar :user="user" class="h-[54px] rounded-[8px] text-[54px] w-[54px]"></Avatar>
                <div class="w-[calc(100%-54px-1rem)]">
                    <div class="flex flex-row gap-x-1 items-center">
                        <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                        <div class="font-bold text-[12pt] webkit-box-1">{{ user.nickname }}</div>
                        <IconVerify
                            v-if="user.verified"
                            class="dark:text-onPrimary h-[0.9rem] shrink-0 text-primary w-[0.9rem]">
                        </IconVerify>
                    </div>
                    <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                    <div class="brief dark:text-white/50 text-[10pt] text-gray-500 webkit-box-2">{{ user.brief }}</div>
                </div>
            </div>
        </div>

        <!-- eslint-disable-next-line vue/max-attributes-per-line -->
        <div v-if="state.threading.length > 0" class="bg-gray-50 dark:bg-[#1e1e1e] rounded-[8px]">
            <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
            <div class="font-bold pb-2 pt-4 px-4 text-[12pt]">当前热门</div>
            <ol class="list-decimal list-inside">
                <li
                    v-for="value in state.threading"
                    :key="value.rank"
                    class="active:bg-gray-200 active:dark:bg-neutral-700 hover:bg-gray-100 hover:dark:bg-neutral-800 hover:last:rounded-b-[8px] px-4 py-3 text-[0.9rem]"
                    @click="routeToSearch(value.key)">
                    <span>{{ value.key }}<span v-if="value.rank <= 3">🔥</span></span>
                    <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                    <div class="dark:text-neutral-500 pl-4 text-[0.85rem] text-gray-400">热度{{ humanizedNumber(value.score) }}</div>
                </li>
            </ol>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue'
import Avatar from '@/components/Avatar.vue'
import { getHotSearch } from '@/indexApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
import { humanizedNumber } from '@/indexApp/utils/formatUtils.js'
import { useRouter } from 'vue-router'
import IconVerify from '@/components/icons/IconVerify.vue'

const router = useRouter()
const showUnImpl = JSON.parse(import.meta.env.VITE_SHOW_UNFINISHED)
const state = reactive({
    users: [],
    threading: [],
    hotSearchCount: 10
})

async function doGetHotSearch() {
    try {
        const response = await getHotSearch(state.hotSearchCount)
        if (!response.ok) throw new Error((await response.json()).message)

        const result = await response.json()
        state.threading = result
    } catch (e) {
        store.setErrorMsg(e.message)
    }
}

function routeToSearch(key) {
    router.replace({ name: 'search', query: { key: btoa(encodeURIComponent(key)) } })
}

doGetHotSearch()
</script>