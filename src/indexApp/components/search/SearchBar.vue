<!-- eslint-disable vue/no-v-html -->
<template>
    <Header
        :title="state.headerConfig.title"
        :go-back="state.headerConfig.goBack"
        :show-menu="state.headerConfig.showMenu"
        :menu-icon="state.headerConfig.menuIcon"
        :icon-tooltip="state.headerConfig.iconTooltip"
        class="px-2 py-2 sticky">
        <div class="flex flex-1 flex-row h-full text-sm">
            <select
                id="type-select"
                v-model.trim="state.type"
                name="search-type"
                class="border-[1px] border-r-0 cursor-pointer focus:outline-none h-full pl-2 rounded-l-full">
                <option
                    v-for="([k, { zh, show }]) in state.suggests.typeMap"
                    v-show="show"
                    :key="k"
                    :value="k">
                    {{ zh }}
                </option>
            </select>
            <input
                v-model="state.prompt"
                type="text"
                placeholder="搜你想搜的"
                maxlength="20"
                class="border-[1px] border-l-0 focus:outline-none h-full px-2 rounded-r-full w-full"
                @keyup.enter.exact="search()"
                @click.left="state.prompt ? () => { } : showSearchHistory()" />
        </div>
        <Transition name="fade">
            <div
                v-if="state.suggests.show"
                id="search-suggest"
                class="bg-white border-[1px] divide-y fixed flex flex-col max-h-[min(24rem,75vh)] overflow-y-auto rounded-[8px] shadow-md text-base top-[50px] w-[calc(100%-1rem)] z-[105]">
                <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                <div v-if="state.suggests.hintSuggests" class="suggests">
                    <div
                        v-for="(suggests, index) in state.suggests.hintSuggests"
                        :key="index"
                        :index="index">
                        <div
                            :class="[index === 'HISTORY' ? 'flex' : 'hidden']"
                            class="backdrop-blur-sm bg-gray-100/75 flex-row font-bold gap-x-2 h-[3rem] items-center justify-start px-4 sticky text-black top-0">
                            <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                            <div class="material-icons-round no-hover">{{ state.suggests.typeMap.get(index).icon }}</div>
                            <div>{{ state.suggests.typeMap.get(index).zh }}</div>
                        </div>
                        <div
                            v-for="suggest in suggests"
                            :key="suggest.content.id"
                            :class="[index === 'USER' ? 'h-[calc(2.8rem+1.4rem)]' : 'h-[3rem]']"
                            class="active:bg-gray-100 bg-white cursor-pointer flex hover:bg-gray-50 items-center justify-start px-4"
                            :index="suggest.content.id"
                            @click="index === 'USER' ? routeTo(index, suggest.content.nickname) : search(contentText(suggest.content.content, index))">
                            <div
                                v-if="index === 'USER'"
                                class="flex flex-nowrap flex-row gap-x-4 items-center justify-start">
                                <Avatar
                                    :user="suggest.content"
                                    class="h-[2.8rem] rounded-[6px] text-[2.8rem] w-[2.8rem]">
                                </Avatar>
                                <div class="flex flex-col flex-nowrap h-max items-start justify-start">
                                    <div class="cursor-pointer flex flex-row gap-x-1 items-center justify-start">
                                        <!-- eslint-disable-next-line vue/html-self-closing -->
                                        <div
                                            class="font-bold hover:underline text-base"
                                            v-html="suggest.content.nickname">
                                        </div>
                                        <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                                        <IconVerify v-if="suggest.content.verified" class="h-[0.9rem] text-blue-500 w-[0.9rem]"></IconVerify>
                                    </div>
                                    <div class="font-light text-[0.8rem] text-gray-500 webkit-box-1">
                                        {{ suggest.content.verifiedInfo || suggest.content.remark || '这个人什么也没写' }}
                                    </div>
                                </div>
                            </div>
                            <div
                                v-else
                                class="flex flex-row items-center justify-between w-full">
                                <!-- eslint-disable-next-line vue/html-self-closing -->
                                <div v-html="contentText(suggest.content.content, index)"></div>
                                <div
                                    v-if="suggest.content.type === 'HISTORY'"
                                    class="close material-icons-round no-hover"
                                    @click.stop="removeHistory(suggest.content.id)">
                                    close
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    v-else-if="state.suggests.showLoading"
                    class="flex flex-col gap-y-2 h-[8rem] items-center justify-center">
                    <IconLoading class="h-5 text-slate-500 w-5"></IconLoading>
                    <span class="text-base">{{ state.suggests.loadingText }}</span>
                </div>
                <div class="flex-col gap-y-1 h-[8rem] hidden items-center justify-center">
                    <span class="material-icons-round no-hover"> search_off </span>
                    <span class="text-base">{{ state.suggests.failText }}</span>
                </div>
            </div>
        </Transition>
    </Header>
</template>

<style scoped>
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

.material-icons-round.no-hover {
    font-size: 18pt;
    padding: 0;
}

.material-icons-round.close {
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

@media not all and (min-width: 640px) {
    #h {
        height: 56px;
    }
}
</style>

<script setup>
import IconLoading from '@/components/icons/IconLoading.vue'
import { reactive, watch, onMounted, onUnmounted } from 'vue'
import { globalSearchSuggest } from '@/indexApp/js/api.js'
import Avatar from '@/components/Avatar.vue'
import IconVerify from '@/components/icons/IconVerify.vue'
import { substringBySegmenter } from '@/indexApp/utils/formatUtils.js'
import Header from '@/indexApp/components/Header.vue'

const emits = defineEmits(['routeTo', 'search'])
const props = defineProps({
    /** 传入的搜索关键词对象 */
    prompt: {
        type: Object,
        required: true
    }
})
// eslint-disable-next-line vue/no-setup-props-reactivity-loss
const state = reactive({
    headerConfig: {
        title: '',
        goBack: true,
        showMenu: false,
        menuIcon: 'checklist',
        iconTooltip: '高级筛选'
    },
    prompt: '',
    maxPromptLen: 20,
    type: 'ALL',
    suggests: {
        show: false,
        hintSuggests: null,
        showLoading: false,
        loadingText: '正在搜索中......',
        failText: '无结果',
        typeMap: props.prompt.typeMap,
        lock: false
    },
    apiSuggests: null,
    toSearch: false,
    timeoutIds: []
})

watch(() => state.prompt, (newVal, oldVal) => {
    if (!newVal) {
        showSearchHistory()
        return
    }

    // 请求服务器和快速回退输入时不触发联想功能
    if (state.suggests.showLoading || oldVal.substring(0, oldVal.length - 1) === newVal) return
    // 若lock未true,则不触发，冷待冷却时间
    if (state.suggests.lock) return
    // 输入的prompt为空，则不触发联想功能
    if (!state.prompt) return
    // 按下enter键时，也不触发
    if (state.toSearch) return

    state.suggests.show = true
    state.suggests.lock = true
    const timeoutId = setTimeout(() => { state.suggests.lock = false }, 500)
    state.timeoutIds.push(timeoutId)
    searchSuggest()
})

function showSearchHistory() {
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

function storeSearchHistory(word) {
    if (!word) return
    const key = 'SUGGEST_HISTORY'
    const history = JSON.parse(localStorage.getItem(key)) || { HISTORY: [] }
    while (history.HISTORY.length >= 10) {
        history.HISTORY.pop()
    }

    const alreadyExist = history.HISTORY.findIndex(it => it.content.content === word)
    if (alreadyExist != -1) {
        history.HISTORY.splice(alreadyExist, 1)
    }

    history.HISTORY.unshift({ type: 'HISTORY', content: { id: new Date().getTime(), content: word, type: 'HISTORY' } })
    localStorage.setItem(key, JSON.stringify(history))
}

function removeHistory(id) {
    const key = 'SUGGEST_HISTORY'
    const preDeleteIndex = state.suggests.hintSuggests.HISTORY.findIndex(it => it.content.id === id)
    if (preDeleteIndex === -1) return
    state.suggests.hintSuggests.HISTORY.splice(preDeleteIndex, 1)
    localStorage.setItem(key, JSON.stringify(state.suggests.hintSuggests))
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
    state.prompt = word.replaceAll('<em>', '').replaceAll('</em>', '')
    storeSearchHistory(state.prompt)
    const validTypeList = [...state.suggests.typeMap.keys()].filter(it => it !== 'ALL' && it !== 'HISTORY')
    const searchType = state.type === 'ALL' ? validTypeList : [state.type]
    state.toSearch = true
    state.suggests.show = false
    emits('search', { key: state.prompt, type: searchType })
}

function handleDismissSuggestPanel(event) {
    const searchPanel = document.querySelector(`#search>.header`)
    if (searchPanel && !searchPanel.contains(event.target)) {
        state.suggests.show = false
    }
    event.stopPropagation()
}

function handleClickMenu(){
    // TODO Not implement
}

/**
 * 将content转换为最终的显示文本
 * @param {string} content 非user类型suggest的content
 * @param {string} type 词条的类型
 * @returns {string} 符合state.maxPromptLen限制且包含preTag、PostTag的词条
 */
function contentText(content, type){
    if(type === 'HISTORY'){
        return content
    }

    if(content.replaceAll('<em>', '').replaceAll('</em>', '').length <= state.maxPromptLen){
        return content
    }

    if(content.indexOf('</em>') <= state.maxPromptLen){
        return substringBySegmenter(content, state.maxPromptLen, 0)
    }

    return substringBySegmenter(content, state.maxPromptLen, content.indexOf('<em>'))
}

onMounted(() => {
    document.querySelector('#app').addEventListener('click', handleDismissSuggestPanel)
    state.prompt = props.prompt.key || ''
})

onUnmounted(() => {
    document.querySelector('#app').removeEventListener('click', handleDismissSuggestPanel)
    state.timeoutIds.forEach(id => clearTimeout(id))
})
</script>