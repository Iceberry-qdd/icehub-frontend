<!-- eslint-disable vue/no-template-shadow -->
<template>
    <div id="search">
        <div class="header relative">
            <SearchBar
                :prompt="state.prompt"
                @search="search"
                @route-to="routeTo">
            </SearchBar>
        </div>
        <div>
            <!-- eslint-disable-next-line vue/max-attributes-per-line, vue/singleline-html-element-content-newline -->
            <div v-if="showUsers" class="font-bold px-2 py-2 text-[13pt]">用户</div>
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <div v-for="(searches, index) in state.apiSearch" :key="index">
                <div v-if="index === 'USER' && onlySearchUser">
                    <FollowItem
                        v-for="search in searches"
                        :key="search.content.id"
                        :user="search.content">
                    </FollowItem>
                </div>
                <div v-else-if="index === 'USER'">
                    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                    <UserCardSlide :searches="searches" @route-to="routeTo"></UserCardSlide>
                </div>
                <div v-if="index === 'POST'">
                    <TransitionGroup>
                        <PostCard
                            v-for="search in searches"
                            :key="search.content.id"
                            :post="search.content">
                        </PostCard>
                    </TransitionGroup>
                </div>
                <div v-if="index === 'REVIEW'">
                    <TransitionGroup>
                        <Review
                            v-for="search in searches"
                            :key="search.content.id"
                            :review="search.content">
                        </Review>
                    </TransitionGroup>
                </div>
            </div>
        </div>
        <div
            v-if="state.prompt.key"
            id="footer"
            class="flex flex-row h-[10vh] justify-center pt-4 text-gray-500 text-sm w-full">
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <IconLoading v-if="showFooterLoading" class="h-5 text-slate-500 w-5"></IconLoading>
            <span v-else>没有更多了</span>
        </div>
        <!-- eslint-disable-next-line vue/max-attributes-per-line -->
        <div v-else class="flex flex-nowrap h-[9.5rem] items-center justify-center mt-20 w-full">
            <!-- eslint-disable-next-line vue/html-self-closing -->
            <div class="bg-[url('/src/assets/search.svg')] bg-center bg-contain bg-no-repeat h-[9.5rem] w-[9.5rem]"></div>
        </div>
    </div>
</template>

<style scoped>
.v-move,
.v-enter-active,
.v-leave-active {
    transition: all 0.5s cubic-bezier(0.39, 0.58, 0.57, 1);
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}

.v-leave-active {
    position: absolute;
    width: 100%;
    height: fit-content;
}
</style>

<script setup>
import { defineAsyncComponent } from 'vue'
import SearchBar from '@/indexApp/components/search/SearchBar.vue'
import { useRouter, useRoute } from 'vue-router'
import { reactive, computed, onMounted, onUnmounted, provide } from 'vue'
import { globalSearch } from '@/indexApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
import IconLoading from '@/components/icons/IconLoading.vue'
const UserCardSlide = defineAsyncComponent(() => import('@/indexApp/components/search/UserCardSlide.vue'))
const PostCard = defineAsyncComponent(() => import('@/indexApp/components/postDetail/PostCard.vue'))
const Review = defineAsyncComponent(() => import('@/indexApp/components/postDetail/Review.vue'))
const FollowItem = defineAsyncComponent(() => import('@/indexApp/components/follow/FollowItem.vue'))

const router = useRouter()
const route = useRoute()
const state = reactive({
    prompt: {
        key: undefined,
        typeMap: new Map([
            ['ALL', { zh: '全部', routePrefix: '', icon: 'history', fetch: false, show: true, once: false }],
            ['HISTORY', { zh: '历史', routePrefix: '', icon: 'history', fetch: false, show: false, once: false }],
            ['USER', { zh: '用户', routePrefix: 'profile', icon: 'history', fetch: true, show: true, once: true }],
            ['POST', { zh: '帖子', routePrefix: 'post', icon: 'history', fetch: true, show: true, once: false }],
            ['REVIEW', { zh: '评论', routePrefix: 'review', icon: 'history', fetch: true, show: true, once: false }]
        ]),
        type: ['ALL'],
        pageIndex: 0,
        pageSize: 10
    },
    apiSearch: {},
    hasMore: false,
    isLoading: false
})

const showUsers = computed(() => {
    return state.apiSearch && Object.keys(state.apiSearch).includes('USER')
})

const showFooterLoading = computed(() => {
    return state.hasMore || state.isLoading
})

const onlySearchUser = computed(() => {
    return state.prompt.type.length === 1 && state.prompt.type[0] === 'USER'
})

// 包含只fetch一次和不需要fetch的类型
const invalidTypes = computed(() => {
    return [...state.prompt.typeMap.entries()]
        .filter(([_, { fetch, once }]) => !fetch || once)
        .map(([k, _]) => k)
})

async function routeTo({ url }) {
    if (!url) {
        state.prompt.key = undefined
        state.prompt.type = ['ALL']
        state.prompt.pageIndex = 0
        state.apiSearch = {}
        router.back()
    } else {
        await router.push(url)
    }
}

function search({ key, type }) {
    state.prompt.key = key
    state.prompt.type = type
    state.prompt.pageIndex = 0
    state.apiSearch = {}
    doSearch()
}

async function doSearch() {
    try {
        state.isLoading = true
        if (!state.prompt.key) return
        if (state.prompt.pageIndex > 0 && !onlySearchUser.value) {
            //第二次fetch时，排除once属性为true的type数据
            state.prompt.type = state.prompt.type.filter(it => !invalidTypes.value.includes(it))
        }
        const response = await globalSearch(state.prompt.key, state.prompt.pageSize, state.prompt.pageIndex, state.prompt.type)
        if (!response.ok) throw new Error((await response.json()).error)

        const result = await response.json()
        Object.keys(result).forEach(type => {
            if (!state.apiSearch.hasOwnProperty(type)) {
                state.apiSearch[type] = []
            }
            state.apiSearch[type].push(...result[type].filter(it => it.content != null))
        })

        state.hasMore = false
        for (const items of Object.values(result)) {
            if (items.length >= state.prompt.pageSize) {
                state.hasMore = true
                break
            }
        }
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    } finally {
        state.isLoading = false
    }
}

function fetchMoreSameSearch() {
    if (!state.hasMore) return

    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const clientHeight = document.documentElement.clientHeight
    const scrollHeight = document.documentElement.scrollHeight

    if (scrollTop + clientHeight >= scrollHeight) {
        setTimeout(() => {
            const lastPageIndex = state.prompt.pageIndex
            state.prompt.pageIndex = lastPageIndex + 1
            doSearch()
        }, 1000)
    }
}

function deletePostOnUi(postId) {
    if (!postId || !state.apiSearch['POST']) return
    const preDeletePostIndex = state.apiSearch['POST'].findIndex(it => it.content.id == postId)
    if (preDeletePostIndex != -1) {
        state.apiSearch['POST'].splice(preDeletePostIndex, 1)
    }
}

function deleteAllPostsOfUserOnUi(userId) {
    if (!userId) return

    const preDeletePosts = state.apiSearch['POST'].filter(it => it.content.user.id == userId)
    if (!preDeletePosts) {
        store.setErrorMsg("删除失败，该帖子不存在！")
        return
    }

    preDeletePosts.forEach(post => {
        const index = state.posts.indexOf(post)
        state.apiSearch['POST'].splice(index, 1)
    })
}

function postingNew(post) {
    state.apiSearch['POST'].unshift({
        type: 'POST',
        content: post
    })
}

onMounted(() => {
    window.addEventListener('scroll', fetchMoreSameSearch)
    const key = route.query?.key
    if (key) {
        const validTypeList = [...state.prompt.typeMap.entries()]
            .filter(([_, { fetch }]) => fetch === true)
            .map(([k, _]) => k)
        search({ key: decodeURIComponent(atob(key)), type: validTypeList })
    }
})

onUnmounted(() => {
    window.removeEventListener('scroll', fetchMoreSameSearch)
})

provide('deletePostOnUi', { deletePostOnUi })
provide('deleteAllPostsOfUserOnUi', { deleteAllPostsOfUserOnUi })
provide('postingNew', { postingNew })
</script>