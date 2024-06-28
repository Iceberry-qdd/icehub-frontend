<!-- eslint-disable vue/no-template-shadow -->
<template>
    <div id="search">
        <SearchBar
            :prompt="state.prompt"
            @search="search"
            @route-to="routeTo">
        </SearchBar>
        <div>
            <!-- eslint-disable-next-line vue/max-attributes-per-line, vue/singleline-html-element-content-newline -->
            <div v-if="showUsers" class="font-bold px-2 py-2 text-[13pt]">用户</div>
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <div v-for="(searches, typeKey) in state.apiSearch" :key="typeKey">
                <div v-if="typeKey.startsWith('USER') && onlySearchUser">
                    <FollowItem
                        v-for="search in searches"
                        :key="search.content.id"
                        :user="search.content">
                    </FollowItem>
                </div>
                <div v-else-if="typeKey.startsWith('USER')">
                    <UserCardSlide
                        v-if="searches"
                        :searches="searches"
                        @route-to="routeTo">
                    </UserCardSlide>
                </div>
                <div v-else-if="typeKey.startsWith('POST')">
                    <TransitionGroup>
                        <PostCard
                            v-for="search in searches"
                            :key="search.content.id"
                            :post="search.content">
                        </PostCard>
                    </TransitionGroup>
                </div>
                <div v-else-if="typeKey.startsWith('REVIEW')">
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
        <Footer
            v-if="state.prompt.key"
            :is-loading="state.isLoading"
            :has-more="state.hasMore"
            @fetch-more="fetchMoreSameSearch">
        </Footer>
        <!-- eslint-disable-next-line vue/max-attributes-per-line -->
        <div v-else class="flex flex-nowrap h-[9.5rem] items-center justify-center max-lg:hidden mt-20 w-full">
            <!-- eslint-disable-next-line vue/html-self-closing -->
            <div class="bg-[url('/src/assets/search.svg')] bg-center bg-contain bg-no-repeat h-[9.5rem] w-[9.5rem]"></div>
        </div>
        <Recommend
            v-if="!state.prompt.key"
            class="lg:hidden">
        </Recommend>
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
import { reactive, computed, onMounted, provide } from 'vue'
import { globalSearch } from '@/indexApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
import Footer from '@/indexApp/components/Footer.vue'
import Recommend from '@/indexApp/components/Recommend.vue'
const UserCardSlide = defineAsyncComponent(() => import('@/indexApp/components/search/UserCardSlide.vue'))
const PostCard = defineAsyncComponent(() => import('@/indexApp/components/postDetail/PostCard.vue'))
const Review = defineAsyncComponent(() => import('@/indexApp/components/postDetail/Review.vue'))
const FollowItem = defineAsyncComponent(() => import('@/indexApp/components/follow/FollowItem.vue'))

const router = useRouter()
const route = useRoute()
const state = reactive({
    prompt: {
        key: decodeSearchKeyOnRoute(),
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
    return state.apiSearch && Object.keys(state.apiSearch).findIndex(it => it.startsWith('USER')) !== -1
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
            // 使用`type + 当前查询页码`作为最后的type，解决: https://github.com/Iceberry-qdd/icehub-frontend/issues/65
            const typeKey = `${type}-${state.prompt.pageIndex}`
            if (!state.apiSearch.hasOwnProperty(typeKey)) {
                state.apiSearch[typeKey] = []
            }
            state.apiSearch[typeKey].push(...result[type].filter(it => it.content != null))
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
    const lastPageIndex = state.prompt.pageIndex
    state.prompt.pageIndex = lastPageIndex + 1
    doSearch()
}

/**
 * 根据baseType和id匹配单个内容，然后删除
 * @param {string} id 内容id
 * @param {string} baseType 要删除的基本类型，POST | REVIEW | USER
 */
function deleteOneOnUiBtBaseType(id, baseType) {
    if (!id || Object.keys(state.apiSearch).findIndex(it => it.startsWith(baseType)) === -1) return

    const {typeKey, index:preDeleteIndex} = findItemIndex(baseType, id)
    if (preDeleteIndex != -1) {
        state.apiSearch[typeKey].splice(preDeleteIndex, 1)
    }
}

/**
 * 返回含有`item.id`的state.apiSearch[`${baseType}-${state.prompt.pageIndex}`]列表(L)中查找到的`typeKey`
 * (即`${baseType}-${state.prompt.pageIndex}`)和item在L中的下标
 * @param {string} baseType 要查找的基础类型，如'USER-0'的基础类型为USER
 * @param {number} id 要查找项的下标
 * @returns {{typeKey: string | undefined; index: number;}} 真实类型typeKey和item的id
 * @summary 若未找到，则返回的typeKey为undefined，index为-1
 */
function findItemIndex(baseType, id){
    const validTypeKeys = Object.keys(state.apiSearch).filter(it => it.startsWith(baseType))

    for (const typeKey of validTypeKeys) {
        const index = state.apiSearch[typeKey].findIndex(it => it.content.id === id)
        if(index !== -1) return {typeKey: typeKey, index: index}
    }
    return {typeKey: undefined, index: -1}
}

/**
 * 根据baseType匹配userId的所有内容，然后删除
 * @param {string} userId 用户id
 * @param {string} baseType 要删除的基本类型，POST | REVIEW
 */
function deleteAllOfUserOnUiByBaseType(userId, baseType) {
    if (!userId) return

    const validTypeKeys = Object.keys(state.apiSearch).filter(it => it.startsWith(baseType))
    for (const typeKey of validTypeKeys) {
        const items = state.apiSearch[typeKey]
        for(let i = items.length - 1; i >= 0; i--){
            const isUserAndHit = baseType === 'USER' && items[i].content.id === userId         
            const isNotUserAndHit = baseType !== 'USER' && items[i].content.user.id === userId
            if(isUserAndHit || isNotUserAndHit){
                state.apiSearch[typeKey].splice(i, 1)
            }   
        }
    }
}

function postingNew(post) {
    // POST-0 指向最开始插入一条帖子
    state.apiSearch['POST-0'].unshift({
        type: 'POST',
        content: post
    })
}

function decodeSearchKeyOnRoute(){
    const key = route.query?.key
    return key ? decodeURIComponent(atob(key)) : undefined
}

onMounted(() => {
    const key = decodeSearchKeyOnRoute()
    if (key) {
        const validTypeList = [...state.prompt.typeMap.entries()]
        .filter(([_, { fetch }]) => fetch === true)
        .map(([k, _]) => k)
        search({ key: key, type: validTypeList })
    }
})

provide('postingNew', { postingNew })
provide('deletePostOnUi', { deletePostOnUi: (postId) => deleteOneOnUiBtBaseType(postId, 'POST') })
provide('deleteAllPostsOfUserOnUi', { deleteAllPostsOfUserOnUi: (userId) => deleteAllOfUserOnUiByBaseType(userId, 'POST') })
provide('deleteReviewOnUi', { deleteReviewOnUi: (review) => deleteOneOnUiBtBaseType(review, 'REVIEW') })
provide('deleteAllReviewsOfUserOnUi', { deleteAllReviewsOfUserOnUi: (userId) => deleteAllOfUserOnUiByBaseType(userId, 'REVIEW') })
provide('deleteAllUsersOfUserOnUi', { deleteAllUsersOfUserOnUi: (userId) => deleteAllOfUserOnUiByBaseType(userId, 'USER') })
</script>