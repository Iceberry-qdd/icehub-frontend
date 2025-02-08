<template>
    <div class="flex flex-row gap-x-2 items-start text-[0.75rem] text-neutral-400">
        <div
            v-if="!!props.passkey.icon"
            id="icon"
            class="aspect-square bg-gray-100 dark:bg-[#262626] flex-none p-2 rounded-lg w-[2.25rem]" />
        <div
            v-else
            class="aspect-square bg-gray-100 cursor-default dark:bg-[#262626] dark:text-white material-symbols-rounded no-hover p-2 rounded-lg text-[#202020] text-[1.25rem] w-[2.25rem]">
            passkey
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
                    @click="changeName">
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
                class="text-onError">
                {{ invalidNameChecker.reason }}
            </div>
            <div
                v-if="!!props.passkey.provider"
                class="webkit-box-1">
                <span>提供方：</span>
                <span>{{ props.passkey.provider }}</span>
            </div>
            <div class="flex gap-x-2 max-sm:flex-col">
                <div class="webkit-box-1">
                    <span>创建于：</span>
                    <span>{{ standardDate(props.passkey.createdTime) }}</span>
                </div>
                <span class="max-sm:hidden text-neutral-200">|</span>
                <div class="webkit-box-1">
                    <span>最近使用：</span>
                    <span>{{ humanizedTime(props.passkey.lastUsedAt) }}</span>
                </div>
            </div>
        </div>
        <div
            class="bg-error btn cursor-pointer font-bold place-items-center py-[0.4rem] rounded-full self-center text-[0.9rem] text-onError w-[4.75rem]"
            @click="deletePasskey">
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
    background-image: v-bind(icon);
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    background-origin: content-box;
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
const ConfirmDialogBox = defineAsyncComponent(() => import('@/components/ConfirmDialogBox.vue'))

const emits = defineEmits(['deleteOnUi', 'newName'])
const passkeyName = ref()
const props = defineProps({
    /**
     * 外部传递过来的passkey条目数据
     * @type {{id:string, createdTime:number, icon:string, provider:string, name:string, lastUsedAt:number}}
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
        text: undefined
    }
})

const icon = computed(() => {
    return `url(${props.passkey.icon})`
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

function deletePasskey() {
    state.confirmBDialogUi.show = true
    state.loading = true
}

// TODO
async function doDeletePasskey() {
    try {
        state.confirmBDialogUi.loading.show = true
        setTimeout(() => {
            store.setSuccessMsg('删除成功！')
            emits('deleteOnUi', props.passkey.id)
        }, 3000)

    } catch (e) {
        store.setErrorMsg(e.message)
    } finally {
        state.confirmBDialogUi.loading = false
        state.confirmBDialogUi.show = false
        state.loading = false
    }
}

function changeName() {
    passkeyName.value.contentEditable = 'plaintext-only'
}

function cancelChangeName() {
    passkeyName.value.removeAttribute('contenteditable')
    passkeyName.value.innerText = props.passkey.name
    state.passkeyName.text = props.passkey.name
}

// TODO
function submitNewName() {
    state.passkeyName.loading = true
    passkeyName.value.removeAttribute('contenteditable')

    setTimeout(() => {
        const newName = passkeyName.value.innerText
        emits('newName', props.passkey.id, newName)
        state.passkeyName.loading = false
    }, 2500)
}

function listenNameInput(e) {
    if (e instanceof InputEvent && e.isComposing) return // 仅监听非组合的输入事件

    const text = e.target.innerText
    state.passkeyName.text = text
}

const invalidNameChecker = computed(() => {
    const text = state.passkeyName.text || ''
    if (text.length > 16) {
        return {
            result: true,
            reason: '名称长度需不超过16个字！'
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
})
</script>