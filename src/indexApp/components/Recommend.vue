<template>
    <div class="flex flex-col gap-y-4 p-4">
        <!-- eslint-disable-next-line vue/max-attributes-per-line -->
        <div v-if="showUnImpl" class="bg-blue-100 p-4 rounded-[8px]">
            <!-- TODO implement it. -->
            <div class="flex flex-row items-center justify-between mb-2">
                <span class="font-bold text-[12pt]">猜你喜欢</span>
                <span class="cursor-pointer hover:underline hover:underline-offset-2 text-[10pt] text-blue-500">换一换</span>
            </div>
            <div
                v-for="user in state.users"
                :key="user.nickname"
                class="active:bg-blue-300/60 cursor-pointer flex flex-row gap-x-4 hover:bg-blue-200 p-2 rounded-[8px]">
                <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                <Avatar :user="user" class="h-[54px] rounded-[8px] text-[54px] w-[54px]"></Avatar>
                <div class="w-[calc(100%-54px-1rem)]">
                    <div class="flex flex-row gap-x-1 items-center">
                        <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                        <div class="font-bold text-[12pt] webkit-box-1">{{ user.nickname }}</div>
                        <IconVerify
                            v-if="user.verified"
                            class="h-[0.9rem] shrink-0 text-blue-500 w-[0.9rem]">
                        </IconVerify>
                    </div>
                    <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                    <div class="brief text-[10pt] webkit-box-2">{{ user.brief }}</div>
                </div>
            </div>
        </div>

        <!-- eslint-disable-next-line vue/max-attributes-per-line -->
        <div v-if="state.threading.length > 0" class="bg-gray-50 rounded-[8px]">
            <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
            <div class="font-bold pb-2 pt-4 px-4 text-[12pt]">当前热门</div>
            <ol class="list-decimal list-inside">
                <li
                    v-for="value in state.threading"
                    :key="value.rank"
                    class="active:bg-gray-200 hover:bg-gray-100 hover:last:rounded-[8px] px-4 py-3 text-[11pt]"
                    @click="routeToSearch(value.key)">
                    <span>{{ value.key }}<span v-if="value.rank <= 3">🔥</span></span>
                    <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                    <div class="pl-4 text-[10pt] text-gray-400">热度{{ humanizedNumber(value.score) }}</div>
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
    users: [
        {
            "avatar": "https://api.multiavatar.com/Iceberry.svg",
            "verified": true,
            "nickname": "Iceberry gvvg hbhh bhbhh bhbhb hb bb bbb jjhg uyftyft",
            "brief": "国家剧团作家，做有《家有儿女》等"
        },
        {
            "avatar": "https://api.multiavatar.com/Iceberryss.svg",
            "verified": true,
            "nickname": "Kotlin developer",
            "brief": "Orginize develop mettings."
        },
        {
            "avatar": "https://api.multiavatar.com/Iceberrys.svg",
            "verified": true,
            "nickname": "Iceberrys",
            "brief": "国家剧团作家，做有《家有儿女》等和毫不含糊v胡v胡vv规合并报表v结果v结果v国家预防感觉划v"
        }
    ],
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
    router.push({ name: 'search', query: { key: btoa(encodeURIComponent(key)) } })
}

doGetHotSearch()
</script>