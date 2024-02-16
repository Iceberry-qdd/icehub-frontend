<template>
    <div
        id="user-card-slide"
        ref="container"
        class="flex flex-nowrap flex-row gap-x-2 overflow-auto pb-2 pt-0 px-0 scroll-p-2 scroll-smooth snap-mandatory snap-x">
        <div class="flex flex-col flex-nowrap items-center justify-center left-0 sticky z-[99]">
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
        <div class="flex flex-col flex-nowrap items-center justify-center right-0 sticky z-[99]">
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
import { reactive, ref } from 'vue'

const props = defineProps({
    /** 传入的搜索对象 */
    // eslint-disable-next-line vue/no-unused-properties
    searches: {
        type: Object,
        required: true
    }
})
const emits = defineEmits(['routeTo'])

const state = reactive({
    userCardList: [],
    curScrollIndex: 0
})

const container = ref()

function routeToProfile(nickname) {
    emits('routeTo', { url: `/profile/${nickname}` })
}

function scrollToNext() {
    // TODO 滚动条划到最右，隐藏指示器
    // if(container.value.scrollLeft > container.value.offsetWidth){
    //     container.value.scrollLeft = container.value.offsetWidth
    //     return 
    // }
    container.value.scrollLeft += container.value.offsetWidth / 2
}

function scrollToPre() {
    // TODO 滚动条划到最左，隐藏指示器
    // if(container.value.scrollLeft < container.value.offsetWidth / 2){
    //     container.value.scrollLeft = 0
    //     return
    // }
    container.value.scrollLeft -= container.value.offsetWidth / 2
}
</script>