<template>
    <div>
        <div id="h" class="flex flex-row justify-between text-[15pt] items-center px-[1rem]">
            <div class="text-[15pt] h-full flex flex-row items-center">
                <div @click="routeBackTo" v-if="state.backArrow"
                    class="material-icons-round cursor-pointer text-[14pt] mr-[0.5rem]">
                    arrow_back_ios
                </div>
                <div class="text-[14pt]">{{ state.titleText }}</div>
            </div>
            <div>
                <span v-if="state.menuIcon" @click="handleAction" class="material-icons-round text-[14pt]">{{ state.menuIcon }}</span>
            </div>
        </div>
        <div id="h-hide"></div>
    </div>

</template>

<style scoped>
#h {
    background-color: rgb(255 255 255 / 84%);
    backdrop-filter: blur(25px);
    z-index: 104;
    width: 38.45%;
    height: 56px;
    position: fixed;
    border-bottom: 1px solid #EEEEEE;
}

#h-hide {
    width: 1px;
    height: 56px;
}
</style>

<script setup>
import { reactive } from 'vue';
import router from '@/route';
import { store } from '@/store';

const props = defineProps(['title', 'goBack', 'showMenu', 'menuIcon', 'menuAction'])

const state = reactive({
    backArrow: props.goBack,
    titleText: props.title,
    menuIcon: props.menuIcon,
    showMenu: props.showMenu,
    menuAction: props.menuAction,
    routeUrl: '/',
    editIcon: '',
    url: window.location.href,
    submit: false
})


function handleAction() {
    const action = state.menuAction.action
    const param = state.menuAction.param
    switch (action) {
        case 'route':
            routeTo(param)
            break;
        case 'submit':
            store.IS_SUBMIT = param
            break
        default:
            break;
    }
}

function routeTo(url) {
    if (!url) return
    router.push(url)
}

function routeBackTo() {
    router.back()
}

</script>