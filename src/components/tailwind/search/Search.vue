<template>
    <div id="search">
        <div class="header relative">
            <SearchBar
                @search="search"
                @routeTo="routeTo">
            </SearchBar>
        </div>
        <div>
            <div class="text-[13pt] font-bold px-2 py-2">用户</div>
            <div
                v-for="(searches, index) in state.apiSearch"
                :index = "index">
                <div
                    v-if="index === 'USER'"
                    class="flex flex-row flex-nowrap px-2 pt-0 pb-2 gap-x-2 overflow-auto">
                    <UserCard
                        class="w-[calc(50%-1rem)] h-[12.5rem] grow-0 shrink-0 cursor-pointer hover:shadow-lg transition-shadow delay-100"
                        v-for="search in searches"
                        :index="search.content.id"
                        :user="search.content">
                    </UserCard>
                </div>
                <div v-if="index === 'POST'">
                    <PostCard v-for="search in searches" :index="search.content.id" :post="search.content"></PostCard>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>

<script setup>
import SearchBar from '@/components/tailwind/search/SearchBar.vue'
import router from '@/route'
import { reactive } from 'vue'
import UserCard from '@/components/tailwind/search/UserCard.vue'
import PostCard from '@/components/bootstrap/PostCard.vue'

const state = reactive({
    key: '',
    apiSearch: null
})

function routeTo({ url }) {
    if (!url) {
        router.back()
    } else {
        router.push(url)
    }
}

function search({ key }) {
    state.key = key
}
</script>