<template>
    <div>
        <div id="h"
            class="flex flex-row border-btm justify-start items-center gap-x-1 px-[0.5rem] text-[11pt] py-2 w-[calc(100%*5/13)]">
            <div
                @click="routeTo()"
                title="返回"
                class="material-icons-round cursor-pointer text-[12pt]">
                arrow_back_ios
            </div>
            <div class="w-full h-full flex flex-row">
                <select
                    v-model.trim="state.type"
                    name="search-type"
                    id="type-select"
                    class="border-[1px] h-full rounded-l-full border-r-0 pl-2 focus:outline-none cursor-pointer">
                    <option v-for="([k, { zh, show }]) in state.suggests.typeMap" :value="k" v-show="show">{{ zh }}</option>
                </select>
                <input
                    @keyup.enter.exact="search()"
                    @click.left="state.prompt ? () => {} : showSearchHistory()"
                    type="text"
                    v-model="state.prompt"
                    placeholder="搜你想搜的"
                    maxlength="20"
                    class="w-full h-full border-[1px] border-l-0 rounded-r-full px-2 focus:outline-none" />
            </div>
            <div
                :title="state.headerConfig.iconTooltip"
                v-if="state.headerConfig.showMenu">
                <span
                    v-if="state.headerConfig.menuIcon"
                    @click="handleAction"
                    class="material-icons-round text-[14pt]">
                    {{ state.headerConfig.menuIcon }}
                </span>
            </div>
        </div>
        <div id="h-hide"></div>
        <Transition name="fade">
            <div
                id="search-suggest"
                v-if="state.suggests.show"
                class="fixed w-[calc(100%*5/13-1rem)] max-h-[75vh] overflow-y-auto flex flex-col divide-y z-[105] left-[calc(100%*(8/13)/2+0.5rem)] top-[50px] border-[1px] rounded-[8px] bg-white shadow-md">
                <div class="suggests" v-if="state.suggests.hintSuggests">
                    <div
                        v-for="(suggests, index) in state.suggests.hintSuggests"
                        :index="index">
                        <div
                            :class="[index === 'HISTORY' ? 'flex' : 'hidden']"
                            class="flex-row justify-start items-center gap-x-2 px-4 h-[3rem] text-[14pt] bg-gray-100/75 text-black font-bold sticky top-0 backdrop-blur-sm">
                            <div class="material-icons-round no-hover">{{ state.suggests.typeMap.get(index).icon }}</div>
                            <div>{{ state.suggests.typeMap.get(index).zh }}</div>
                        </div>
                        <div
                            :class="[index === 'USER' ? 'h-[calc(2.8rem+1.4rem)]' : 'h-[3rem]']"
                            class="flex justify-start items-center px-4 bg-white hover:bg-gray-50 active:bg-gray-100 cursor-pointer"
                            v-for="suggest in suggests"
                            :index="suggest.content.id"
                            @click="index === 'USER' ? routeTo(index, suggest.content.nickname) : search(suggest.content.content)">
                            <div
                                v-if="index === 'USER'"
                                class="flex flex-row flex-nowrap justify-start items-center gap-x-4">
                                <Avatar
                                    :user="suggest.content"
                                    class="w-[2.8rem] h-[2.8rem] rounded-[6px] text-[11pt]">
                                </Avatar>
                                <div class="flex flex-col flex-nowrap justify-start items-start h-max">
                                    <div class="text-[12pt] text-black font-bold">
                                        {{ suggest.content.nickname }}
                                        <i class="text-[10pt] bi bi-patch-check-fill verify text-blue-500" v-if="suggest.content.verified"></i>
                                    </div>
                                    <div class="text-[10pt] font-light text-gray-500 brief">
                                        {{suggest.content.verifiedInfo || suggest.content.remark || '这个人什么也没写' }}
                                    </div>
                                </div>
                            </div>
                            <div v-else class="flex flex-row justify-between items-center w-full">
                                <div>{{ suggest.content.content }}</div>
                                <div
                                    @click.stop="removeHistory(suggest.content.id)"
                                    v-if="suggest.content.type === 'HISTORY'"
                                    class="material-icons-round no-hover close">
                                    close
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else-if="state.suggests.showLoading" class="flex flex-col gap-y-2 justify-center items-center h-[8rem]">
                    <IconLoading class="h-5 w-5 text-slate-500"></IconLoading>
                    <span class="text-[11pt]">{{ state.suggests.loadingText }}</span>
                </div>
                <div class="hidden flex-col gap-y-1 justify-center items-center h-[8rem]">
                    <span class="material-icons-round no-hover"> search_off </span>
                    <span class="text-[11pt]">{{ state.suggests.failText }}</span>
                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.brief{
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
}
.border-btm {
    border-bottom: 1px solid #EEEEEE;
}

#h {
    background-color: rgb(255 255 255 / 84%);
    backdrop-filter: blur(25px);
    z-index: 104;
    height: 56px;
    position: fixed;
}

#h-hide {
    width: 1px;
    height: 56px;
}

.fade-enter-active {
    transition: opacity 0.1s ease-in-out;
}

.fade-leave-active {
    transition: opacity 0.1s ease-in-out;
}

.fade-enter-from {
    opacity: 0;
}

.fade-leave-to {
    opacity: 0;
}

.no-hover:hover{
    background-color: transparent;
}

.material-icons-round.no-hover{
    font-size: 18pt;
    padding: 0;
}

.material-icons-round.close{
    font-size: 13pt;
    padding: calc((3rem - 13pt) / 2);
}

#search-suggest::-webkit-scrollbar {
    width: 6px !important;
    height: 100% !important;
    -webkit-appearance: none;
    background: transparent;
    border-radius: 9999px;
}

#search-suggest::-webkit-scrollbar-thumb {
    width: 6px !important;
    -webkit-appearance: none;
    background: #E6E8EB;
    border-radius: 9999px;
}
</style>

<script setup>
import IconLoading from '@/components/icons/IconLoading.vue'
import { reactive, watch, onMounted, onUnmounted } from 'vue'
import { globalSearchSuggest } from '@/api'
import Avatar from '@/components/tailwind/Avatar.vue'

const emits = defineEmits(['routeTo', 'search'])
const props = defineProps(['typeMap'])
const state = reactive({
    headerConfig: {
        title: '搜索',
        goBack: false,
        showMenu: false,
        menuIcon: 'checklist',
        width: 0,
        iconTooltip: '高级筛选'
    },
    prompt: '',
    type: 'ALL',
    suggests: {
        show: false,
        hintSuggests: null,
        showLoading: false,
        loadingText: '正在搜索中......',
        failText: '无结果',
        typeMap: props.typeMap,
        lock: false
    },
    apiSuggests: null,
    toSearch : false,
    timeoutIds: []
})

watch(() => state.prompt, (newVal, oldVal) => {
    if (!newVal) {
        showSearchHistory()
        return
    }

    // 请求服务器和快速回退输入时不触发联想功能
    if(state.suggests.showLoading || oldVal.substring(0, oldVal.length - 1) === newVal) return
    // 若lock未true,则不触发，冷待冷却时间
    if(state.suggests.lock) return
    // 输入的prompt为空，则不触发联想功能
    if(!state.prompt) return
    // 按下enter键时，也不触发
    if(state.toSearch) return
    
    state.suggests.show = true
    state.suggests.lock = true
    const timeoutId = setTimeout(() => { state.suggests.lock = false }, 500)
    state.timeoutIds.push(timeoutId)
    searchSuggest()
})

function showSearchHistory(){
    const key = 'SUGGEST_HISTORY'
    state.suggests.hintSuggests = JSON.parse(localStorage.getItem(key))
    state.suggests.show = true
}

async function searchSuggest() {
    state.suggests.show = true
    state.suggests.showLoading = true
    try {
        const validTypeList = [...state.suggests.typeMap.entries()]
            .filter(([_, { fetch }]) => fetch === true)
            .map(([k, _]) => k)
        const searchType = state.type === 'ALL' ? validTypeList : [state.type]
        const response = await globalSearchSuggest(state.prompt, searchType)
        if (!response.ok) throw new Error((await response.json()).error)

        const result = await response.json()
        state.suggests.hintSuggests = Object.keys(result).length > 0 ? result : null
        state.suggests.show = Object.keys(result).length > 0
    } catch (e) {
        console.error(e)
        state.suggests.show = false
    } finally {
        state.suggests.showLoading = false
    }
}

function storeSearchHistory(word){
    if(!word) return
    const key = 'SUGGEST_HISTORY'
    const history = JSON.parse(localStorage.getItem(key)) || {HISTORY: []}
    while(history.HISTORY.length >= 10){
        history.HISTORY.pop()
    }

    const alreadyExist = history.HISTORY.findIndex(it => it.content.content === word)
    if(alreadyExist != -1){
        history.HISTORY.splice(alreadyExist, 1)
    }

    history.HISTORY.unshift({type:'HISTORY', content: {id: new Date().getTime(), content: word, type:'HISTORY'}})
    localStorage.setItem(key,JSON.stringify(history))
}

function removeHistory(id){
    const key = 'SUGGEST_HISTORY'
    const preDeleteIndex = state.suggests.hintSuggests.HISTORY.findIndex(it => it.content.id === id)
    if(preDeleteIndex === -1) return
    state.suggests.hintSuggests.HISTORY.splice(preDeleteIndex, 1)
    localStorage.setItem(key,JSON.stringify(state.suggests.hintSuggests))
}

function routeTo(type, id) {
    if (!type && !id) {
        emits('routeTo', { url: null })
        state.prompt = ''
        state.suggests.show = false
        return
    }
    storeSearchHistory(id)
    const url = `/${state.suggests.typeMap.get(type).routePrefix}/${id}`
    state.suggests.show = false
    emits('routeTo', { url: url })
}

function search(word = state.prompt) {
    state.prompt = word
    storeSearchHistory(word)
    const validTypeList = [...state.suggests.typeMap.keys()].filter(it => it !== 'ALL' && it !== 'HISTORY')
    const searchType = state.type === 'ALL' ? validTypeList : [state.type]
    state.toSearch = true
    state.suggests.show = false
    emits('search', { key: word, type: searchType })
}

function handleDismissSuggestPanel(event) {
    const searchPanel = document.querySelector(`#search>.header`)
    if (searchPanel && !searchPanel.contains(event.target)) {
        state.suggests.show = false
    }
    event.stopPropagation()
}

onMounted(() => {
    document.querySelector('#app').addEventListener('click', handleDismissSuggestPanel)
})

onUnmounted(() => {
    document.querySelector('#app').removeEventListener('click', handleDismissSuggestPanel)
    state.timeoutIds.forEach(id => clearTimeout(id))
})
</script>