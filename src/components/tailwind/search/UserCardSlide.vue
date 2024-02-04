<template>
    <div
        ref="container"
        id="user-card-slide"
        class="flex flex-row flex-nowrap px-0 pt-0 pb-2 gap-x-2 overflow-auto snap-mandatory scroll-p-2 snap-x scroll-smooth">
        <div class="sticky left-0 flex flex-col flex-nowrap justify-center items-center z-[99]">
            <span @click="scrollToPre" class="material-icons-round ml-2 cursor-pointer shadow-md no-hover">arrow_back_ios</span>
        </div>
        <UserCard
            class="user-card w-[calc(50%-1rem)] h-[12.5rem] grow-0 shrink-0 cursor-pointer hover:shadow-lg transition-shadow delay-100 snap-start"
            v-for="search in props.searches"
            :key="search.content.id"
            :id="search.content.id"
            :user="search.content"
            @click.stop="routeToProfile(search.content.nickname)">
        </UserCard>
        <div class="sticky right-0 flex flex-col flex-nowrap justify-center items-center z-[99]">
            <span @click="scrollToNext" class="material-icons-round mr-2 cursor-pointer shadow-md no-hover">arrow_forward_ios</span>
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
import UserCard from '@/components/tailwind/search/UserCard.vue'
import { reactive, ref } from 'vue'

const props = defineProps(['searches'])
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
    container.value.scrollLeft += container.value.offsetWidth / 2
}

function scrollToPre() {
    container.value.scrollLeft -= container.value.offsetWidth / 2
}

</script>