<template>
    <div id="h" class="flex flex-row justify-start gap-x-2 items-center px-2">
        <span @click="routeToIndex" v-if="state.backArrow == true" class="material-icons-round cursor-pointer text-[14pt]">arrow_back_ios</span>{{ state.titleText }}
    </div>
    <div id="h-hide"></div>
</template>

<style scoped>
#h {
    background-color: rgb(255 255 255 / 84%);
    backdrop-filter: blur(25px);
    z-index: 104;
    width: 38.36%;
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
import { reactive, watch } from 'vue';
import { useRoute } from 'vue-router';
import router from '../../route';

const state = reactive({
    backArrow: false,
    titleText: '',
    url: window.location.href
})

const route = useRoute()

watch(() => route.path, (newUrl, oldUrl) => {
    if (newUrl.match('^/(index)?$')) {
        state.backArrow = false
        state.titleText = ''
    } else if (newUrl.match('^/post/.*$')) {
        state.backArrow = true
        state.titleText = '帖子详情'

        const pid = newUrl.replace('/post/','')
        //store.setSelectPostId(pid)
    } else {
        state.backArrow = false
        state.titleText = ''
    }
})

function routeToIndex(){
    router.push('/index')
}

</script>