<template>
    <div class="flex flex-col gap-y-4 p-4">
        <div class="p-4 rounded-[8px] bg-blue-100" v-if="showUnImpl">
            <!-- TODO implement it. -->
            <div class="flex flex-row justify-between items-center mb-2">
                <span class="text-[12pt] font-bold">猜你喜欢</span>
                <span class="text-[10pt] text-blue-500 hover:underline hover:underline-offset-2 cursor-pointer">换一换</span>
            </div>
            <div class="flex flex-row gap-x-4 hover:bg-blue-200 active:bg-blue-300/60 rounded-[8px] p-2 cursor-pointer" v-for="user in state.users">
                <Avatar
                    :user="user"
                    class="w-[54px] h-[54px] rounded-[8px] text-[16pt]">
                </Avatar>
                <div class="w-[calc(100%-54px-1rem)]">
                    <div class="flex flex-row gap-x-1 items-center">
                        <div class="nickname">{{ user.nickname }}</div>
                        <i class="bi bi-patch-check-fill verify text-blue-500" v-if="user.verified"></i>
                    </div>
                    <div class="brief text-[10pt] webkit-box-2">{{ user.brief }}</div>
                </div>
            </div>
        </div>

        <div class="rounded-[8px] bg-gray-50" v-if="state.threading.length > 0">
            <div class="text-[12pt] font-bold px-4 pt-4 pb-2" >当前热门</div>
            <ol class=" list-inside list-decimal">
                <li
                    class="py-3 px-4 hover:bg-gray-100 text-[11pt] hover:last:rounded-[8px] active:bg-gray-200"
                    v-for="value in state.threading"
                    @click="routeToSearch(value.key)"
                    :key="value.rank">
                    <span>{{ value.key }}<span v-if="value.rank <= 3">🔥</span></span>
                    <div class="text-[10pt] text-gray-400 pl-4">热度{{ humanizedNumber(value.score)}}</div>
                </li>
            </ol>
        </div>
    </div>

</template>

<style scoped>
.nickname {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    font-weight: bold;
    font-size: 12pt;
}

.bi {
    font-size: 11pt;
}
</style>

<script setup>
import { reactive } from 'vue'
import Avatar from '@/components/tailwind/Avatar.vue'
import { getHotSearch } from '@/api.js'
import { store } from '@/store'
import { humanizedNumber } from '@/utils/formatUtils'
import { useRouter } from 'vue-router'

const router = useRouter()
const showUnImpl = JSON.parse(import.meta.env.VITE_SHOW_UNFINISHED)
const state = reactive({
    users: [],
    threading:[],
    hotSearchCount: 10
})

async function doGetHotSearch(){
    try{
        const response = await getHotSearch(state.hotSearchCount)
        if (!response.ok) throw new Error((await response.json()).error)

        const result = await response.json()
        state.threading = result
    }catch(e){
        store.setErrorMsg(e.message)
        console.error(e)
    }
}

function routeToSearch(key){
    router.push({ name: 'search', query: { key: btoa(encodeURIComponent(key)) }})
}

doGetHotSearch()
</script>