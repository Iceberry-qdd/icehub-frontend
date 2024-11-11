<template>
    <div>
        <div class="dark:divide-neutral-700 divide-gray-100 divide-y-[1px]">
            <SimpleUserListItem
                v-for="user in state.users"
                :key="user.id"
                :user="user"
                class="active:bg-gray-100 cursor-pointer dark:hover:bg-neutral-900 hover:bg-gray-50 px-4"
                @click="$router.push({name: 'profile', params: {nickname: user.nickname}})">
            </SimpleUserListItem>
        </div>

        <Footer
            :is-loading="state.isLoading"
            :has-more="hasMore"
            @fetch-more="fetchRepostUserList">
        </Footer>
    </div>
</template>

<script setup>
import { computed, reactive, onMounted, watch } from 'vue'
import { store } from '@/indexApp/js/store.js'
import { getRepostListOfPost } from '@/indexApp/js/api.js'
import Footer from '@/indexApp/components/Footer.vue'
import SimpleUserListItem from '@/indexApp/components/postDetail/SimpleUserListItem.vue'

const props = defineProps({
    /** 传入的帖子对象 */
    post: {
        type: Object,
        required: false,
        default: undefined
    }
})
const state = reactive({
    users: [],
    pageIndex: 1,
    pageSize: 10,
    lastTimestamp: new Date().getTime(),
    totalPages: 0,
    isLoading: false
})

const hasMore = computed(() => {
    return state.pageIndex < state.totalPages
})

async function fetchRepostUserList() {
    try {
        state.isLoading = true
        const response = await getRepostListOfPost(props.post.id, state.pageIndex, state.pageSize, state.lastTimestamp)
        if (!response.ok) throw new Error((await response.json()).message)

        const { content, totalPages } = await response.json()
        state.users.push(...content)
        state.totalPages = totalPages
        if (content.length > 1) {
            state.lastTimestamp = content.slice(-1)[0].createdTime
        }
    } catch (e) {
        store.setErrorMsg(e.message)
    } finally {
        state.isLoading = false
    }
}

watch(() => props.post, (newVal, _) => {
    if (!!newVal) {
        fetchRepostUserList()
    }
})

onMounted(async () => {
    if (!!props.post) {
        await fetchRepostUserList()
    }
})
</script>