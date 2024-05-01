<template>
    <div
        id="user-card-slide"
        ref="container"
        class="flex flex-nowrap flex-row gap-x-2 overflow-auto pb-2 pt-0 px-2 scroll-p-2 scroll-smooth snap-mandatory snap-x">
        <div
            v-show="!state.limit.left.reach"
            class="flex flex-col flex-nowrap items-center justify-center left-0 sticky z-[99]">
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <span class="cursor-pointer material-icons-round ml-2 no-hover shadow-md" @click="scrollToPre">arrow_back_ios</span>
        </div>
        <UserCard
            v-for="search in props.searches"
            :id="search.content.id"
            :key="search.content.id"
            class="cursor-pointer delay-100 grow-0 h-[12.5rem] hover:shadow-lg shrink-0 snap-start transition-shadow user-card w-[calc(50%-1rem)]"
            :user="search.content"
            @click.stop="routeToProfile(search.content.nickname)">
        </UserCard>
        <div
            v-show="!state.limit.right.reach"
            class="flex flex-col flex-nowrap items-center justify-center right-0 sticky z-[99]">
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <span class="cursor-pointer material-icons-round mr-2 no-hover shadow-md" @click="scrollToNext">arrow_forward_ios</span>
        </div>
    </div>
</template>

<style scoped>
.material-icons-round{
    font-size: 14pt;
    background-color: #FFFFFF;
    padding: 0.5rem;
    border: 1px solid #EEEEEE;
    transition: padding 100ms ease-in-out 100ms;
}

.material-icons-round:hover{
    background-color: #FFFFFF;
    padding: 0.75rem;
}

#user-card-slide::-webkit-scrollbar {
    width: 100% !important;
    height: 4px !important;
    -webkit-appearance: none;
    background: transparent;
    border-radius: 9999px;
}

#user-card-slide::-webkit-scrollbar-thumb {
    height: 4px !important;
    -webkit-appearance: none;
    background: #E6E8EB;
    border-radius: 9999px;
}
</style>

<script setup>
import UserCard from '@/indexApp/components/search/UserCard.vue'
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'

const container = ref()
const props = defineProps({
    /** 传入的搜索对象 */
    searches: {
        type: Object,
        required: true
    }
})
const emits = defineEmits(['routeTo'])
const state = reactive({
    limit: {
        left: {observeId: undefined, reach: false},
        right: {observeId: undefined, reach: false}
    }
})

function routeToProfile(nickname) {
    emits('routeTo', { url: `/profile/${nickname}` })
}

function scrollToNext() {
    container.value.scrollLeft += container.value.offsetWidth / 2
}

function scrollToPre() {
    container.value.scrollLeft -= container.value.offsetWidth / 2
}

const options = {root: null, rootMargin: '0px', threshold: 0.5}

const leftLimitObserver = new IntersectionObserver((entries) => {
    state.limit.left.reach = entries[0].intersectionRatio >= options.threshold
}, options)

const rightLimitObserver = new IntersectionObserver((entries) => {
    state.limit.right.reach = entries[0].intersectionRatio > options.threshold
}, options)

onMounted(() => {
    state.limit.left.observeId = props.searches.at(0).content.id
    if(state.limit.left.observeId){
        leftLimitObserver.observe(document.querySelector(`#${state.limit.left.observeId}`))
    }

    state.limit.right.observeId = props.searches.at(-1).content.id
    if(state.limit.right.observeId){
        rightLimitObserver.observe(document.querySelector(`#${state.limit.right.observeId}`))
    }
})

onBeforeUnmount(() => {
    if(state.limit.left.observeId){
        leftLimitObserver.unobserve(document.querySelector(`#${state.limit.left.observeId}`))
    }

    if(state.limit.right.observeId){
        rightLimitObserver.unobserve(document.querySelector(`#${state.limit.right.observeId}`))
    }
})
</script>