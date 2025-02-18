<template>
    <div class="flex flex-row gap-x-2 items-start text-[0.75rem] text-neutral-400">
        <div
            v-if="!!props.passkey.provider"
            id="icon"
            class="aspect-square bg-gray-100 dark:bg-[#262626] flex-none p-2 relative rounded-lg w-[2.25rem]">
            <span
                v-if="props.passkey.sync"
                title="该密钥已同步"
                class="absolute bottom-0 material-symbols-rounded no-hover p-0 right-0 sync text-[0.85rem] text-green-500 translate-x-1/3 translate-y-1/3">
                sync
            </span>
        </div>
        <div
            v-else
            class="aspect-square bg-gray-100 cursor-default dark:bg-[#262626] dark:text-white material-symbols-rounded no-hover p-2 relative rounded-lg text-[#202020] text-[1.25rem] w-[2.25rem]">
            passkey
            <span
                v-if="props.passkey.sync"
                title="该密钥已同步"
                class="absolute bottom-0 material-symbols-rounded no-hover p-[0.1rem] right-0 sync text-[0.75rem] text-green-500 translate-x-1/3 translate-y-1/3">
                sync
            </span>
        </div>
        <div class="flex-1">
            <div class="font-bold text-[1rem] webkit-box-1">
                <span
                    ref="passkeyName"
                    :class="{'invalid': invalidNameChecker.result}"
                    class="name text-onSurface"
                    @compositionend="listenNameInput"
                    @input="listenNameInput">
                    {{ state.passkeyName.text }}
                </span>
                <span
                    class="align-middle edit material-symbols-rounded ml-1 no-hover p-0 text-[0.9rem] text-inherit"
                    @click="handleChangeName">
                    edit
                </span>
                <span
                    class="align-middle close hidden material-symbols-rounded ml-1 no-hover p-0 text-[1rem] text-inherit"
                    @click="cancelChangeName">
                    close
                </span>
                <span
                    class="align-middle check hidden material-symbols-rounded ml-2 no-hover p-0 text-[1rem] text-inherit"
                    @click="submitNewName">
                    check
                </span>
                <IconLoading
                    v-if="state.passkeyName.loading"
                    class="align-middle h-3 inline-block loading ml-2 text-inherit w-3"
                    :stroke-width="3">
                </IconLoading>
            </div>
            <div
                v-if="invalidNameChecker.result"
                class="invalid-reason text-onError">
                {{ invalidNameChecker.reason }}
            </div>
            <div
                v-if="!!props.passkey.provider"
                class="webkit-box-1">
                <span>提供方：</span>
                <span>{{ props.passkey.provider?.name || '未知' }}</span>
            </div>
            <div class="flex gap-x-2 max-sm:flex-col">
                <div class="webkit-box-1">
                    <span>创建于：</span>
                    <span>{{ standardDate(props.passkey.createdTime) }}</span>
                </div>
                <span class="max-sm:hidden text-neutral-200">|</span>
                <div class="webkit-box-1">
                    <span>最近使用：</span>
                    <span>{{ humanizedTime(props.passkey.updatedTime) }}</span>
                </div>
            </div>
        </div>
        <div
            class="bg-error btn cursor-pointer flex-none font-bold place-items-center py-[0.4rem] rounded-full self-center text-[0.9rem] text-onError w-[4.75rem]"
            @click="handleDeletePasskey">
            <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
            <div v-if="!state.loading">删除</div>
            <IconLoading
                v-else
                class="h-5 text-inherit w-5">
            </IconLoading>
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

<style scoped>
#icon{
    background-image: v-bind(iconLight);
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    background-origin: content-box;
}

#icon:where([theme="dark"], [theme="dark"] *){
    background-image: v-bind(iconDark);
}

.material-symbols-rounded.sync{
    font-variation-settings: 'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 24;
}

.btn:has(.m-icon){
    pointer-events: none;
}

span.name{
    transition: padding 100ms ease-in-out;
}

span.name[contenteditable]{
    display: inline-block;
    background-color: #f3f4f6;
    line-height: 1.75rem;
    padding: 0 0.5rem;
    border-radius: 4px;
    cursor: text;
    outline: none;
}

div:has(span.name:not([contenteditable])) + div.invalid-reason{
    display: none;
}

span.name[contenteditable]:where([theme="dark"], [theme="dark"] *){
    background-color: rgb(var(--color-primary-container));
}

span.name[contenteditable].invalid{
    box-shadow: inset 0 0 0 0px #fff, inset 0 0 0 1px rgb(var(--color-on-error) / 1);
}

div:has(span.name[contenteditable]) > span:where(.close, .check){
    display: inline-block;
}

div:has(span.name[contenteditable]) > span.edit, div:has(svg.loading) > span:where(.edit, .close, .check){
    display: none !important;
    pointer-events: none;
}

div:has(span.name[contenteditable].invalid) > span.check{
    display: none;
}
</style>

<script setup>
import { computed, reactive, defineAsyncComponent, ref, onMounted } from 'vue'
import { store } from '@/indexApp/js/store.js'
import { humanizedTime, standardDate } from '@/indexApp/utils/formatUtils'
import IconLoading from '@/components/icons/IconLoading.vue'
import { deletePasskey, updatePasskeyName } from '@/indexApp/js/api.js'
import { debounce } from '@/indexApp/utils/jsHelper.js'
const ConfirmDialogBox = defineAsyncComponent(() => import('@/components/ConfirmDialogBox.vue'))

let PASSKEY_CACHED_KEY = 'cache:passkey:${id}:name'
const emits = defineEmits(['deleteOnUi', 'newNamedPasskey'])
const passkeyName = ref()
const props = defineProps({
    /**
     * 外部传递过来的passkey条目数据
     * @type {{id:string, createdTime:number, provider:{name:string, iconLight:string, iconDark:string}, name:string, updatedTime:number}}
     * */
    passkey: {
        type: Object,
        required: true
    }
})

const state = reactive({
    loading: false,
    confirmBDialogUi: {
        show: false,
        title: '确定删除该通行密钥？',
        confirmButton: {
            selected: false,
            color: 'text-onError',
            bgColor: 'bg-error'
        },
        cancelButton: {
            selected: false
        },
        loading: {
            show: false
        }
    },
    passkeyName: {
        loading: false,
        text: undefined,
        maxLength: 16
    }
})

const iconLight = computed(() => {
    return `url(${props.passkey.provider?.iconLight})`
})

const iconDark = computed(() => {
    return `url(${props.passkey.provider?.iconDark})`
})

function choose(args) {
    const choice = args.choice
    if (choice == 'confirm') {
        doDeletePasskey()
    } else {
        state.confirmBDialogUi.show = false
        state.loading = false
    }
}

function handleDeletePasskey() {
    state.confirmBDialogUi.show = true
    state.loading = true
}

async function doDeletePasskey() {
    state.confirmBDialogUi.loading.show = true
    try {
        const response = await deletePasskey(props.passkey.id)
        if (!response.ok) throw new Error((await response.json()).message)

        const isDeleted = await response.json()
        if(!isDeleted) throw new Error('删除失败！')
        emits('deleteOnUi', props.passkey)
    } catch (e) {
        console.error(e)
        store.setErrorMsg(e.message)
    } finally {
        state.confirmBDialogUi.loading = false
        state.confirmBDialogUi.show = false
        state.loading = false
    }
}

function handleChangeName() {
    passkeyName.value.contentEditable = 'plaintext-only'
}

function cancelChangeName() {
    passkeyName.value.removeAttribute('contenteditable')
    passkeyName.value.innerText = props.passkey.name
    state.passkeyName.text = props.passkey.name
    localStorage.removeItem(PASSKEY_CACHED_KEY)
}

async function submitNewName() {
    state.passkeyName.loading = true
    try{
        passkeyName.value.removeAttribute('contenteditable')
        // 名称改前改后相同，直接返回
        if(state.passkeyName.text === props.passkey.name){
            localStorage.removeItem(PASSKEY_CACHED_KEY)
            return
        }
        
        localStorage.setItem(PASSKEY_CACHED_KEY, state.passkeyName.text)
        const response = await updatePasskeyName(props.passkey.id, state.passkeyName.text)
        if(!response.ok) if (!response.ok) throw new Error((await response.json()).message)

        const passkey = await response.json()
        localStorage.removeItem(PASSKEY_CACHED_KEY)
        emits('newNamedPasskey', passkey)
    } catch(e){
        console.error(e)
        store.setErrorMsg(e.message)
    } finally {
        state.passkeyName.loading = false
    }
}

const listenNameInput = debounce(function (e) {
    if (e instanceof InputEvent && e.isComposing) return // 仅监听非组合的输入事件

    const text = e.target.innerText
    if(text.length > state.passkeyName.maxLength + 1){
        e.target.innerText = text.slice(0, state.passkeyName.maxLength + 1)
        moveCursorToEnd(e.target)
    }
    state.passkeyName.text = e.target.innerText
}, 300) 

// 将光标移动到末尾的函数
function moveCursorToEnd(element) {
    const range = document.createRange()
    const selection = window.getSelection()

    range.selectNodeContents(element)
    range.collapse(false)

    selection.removeAllRanges()
    selection.addRange(range)
}

const invalidNameChecker = computed(() => {
    const text = state.passkeyName.text || ''
    if(text.length === 0){
        return {
            result: true,
            reason: '名称不能为空！'
        }
    }

    if (text.length > state.passkeyName.maxLength) {
        return {
            result: true,
            reason: '名称太长！'
        }
    }

    const pattern = /(\n|\r|\t|\u2028|\u2029)/
    if (text.match(pattern)) {
        return {
            result: true,
            reason: '名称不能含有换行符！'
        }
    }

    return { result: false, reason: '' }
})

onMounted(() => {
    state.passkeyName.text = props.passkey.name
    PASSKEY_CACHED_KEY = PASSKEY_CACHED_KEY.replace('${id}', props.passkey.id)
    const tempStoredName = localStorage.getItem(PASSKEY_CACHED_KEY)
    if(!!tempStoredName){
        state.passkeyName.text = tempStoredName
        passkeyName.value.contentEditable = 'plaintext-only'
        moveCursorToEnd(passkeyName.value)
    }
})
</script>