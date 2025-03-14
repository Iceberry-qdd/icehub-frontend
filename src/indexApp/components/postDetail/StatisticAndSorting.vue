<template>
    <div class="border-b-[1px] flex flex-row items-center justify-between pl-4 pr-2 text-[0.85rem]">
        <div class="flex flex-row gap-x-3">
            <div
                class="cursor-pointer hover:dark:text-onPrimary hover:text-primary hover:underline py-2"
                :class="{'text-primary dark:text-onPrimary': $route.name === 'postLikeListPage'}"
                @click="props.likeCount > 0 ? routeTo('postLikeListPage') : undefined">
                <span>{{ props.likeCount }}</span>
                <span>点赞</span>
            </div>
            <div
                class="cursor-pointer hover:dark:text-onPrimary hover:text-primary hover:underline py-2"
                :class="{'text-primary dark:text-onPrimary': ['postDetail', 'postReviewListPage'].includes($route.name)}"
                @click="props.reviewCount > 0 ? routeTo('postReviewListPage') : undefined">
                <span>{{ props.reviewCount }}</span>
                <span>评论</span>
            </div>
            <div
                class="cursor-pointer hover:dark:text-onPrimary hover:text-primary hover:underline py-2"
                :class="{'text-primary dark:text-onPrimary': $route.name === 'postRepostListPage'}"
                @click="props.repostCount > 0 ? routeTo('postRepostListPage') : undefined">
                <span>{{ props.repostCount }}</span>
                <span>转发</span>
            </div>
            <div
                class="hover:dark:text-onPrimary hover:text-primary hover:underline pointer-events-none py-2">
                <span>{{ props.bookmarkCount }}</span>
                <span>收藏</span>
            </div>
        </div>
        <div
            v-if="props.reviewCount > 0 && ['postDetail', 'postReviewListPage'].includes($route.name)"
            class="-gap-x-2 flex flex-row my-1">
            <div
                :title="state.orderDirection[props.sort.direction].zh[props.sort.by]"
                class="hover:bg-gray-100 hover:dark:bg-[#262626] material-symbols-rounded no-hover text-[length:inherit] text-inherit translate-x-2"
                @click="emits('selectOrderDirection', props.sort.direction === 'ASC' ? 'DESC' : 'ASC')">
                {{ state.orderDirection[props.sort.direction].icon }}
            </div>
            <div
                id="sortingMenuBtn"
                title="排序方式"
                class="cursor-pointer hover:bg-gray-100 hover:dark:bg-[#262626] px-3 py-1 relative rounded-full"
                @click="state.showSortingMenu = true">
                {{ state.orderByOptions[props.sort.by].zh }}
                <Transition name="action-fade">
                    <SortingMenu
                        v-if="state.showSortingMenu"
                        class="absolute max-w-[12rem] min-w-[9rem] right-0 top-0 z-[100]"
                        :menus="state.orderByOptions"
                        :order-by="props.sort.by"
                        @pick="selectOrderBy"
                        @dismiss="state.showSortingMenu = false">
                    </SortingMenu>
                </Transition>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
const SortingMenu = defineAsyncComponent(() => import('@/indexApp/components/postDetail/SortingMenu.vue'))

const router = useRouter()
const emits = defineEmits(['selectOrderDirection', 'selectOrderBy'])
const props = defineProps({
    /** 点赞数 */
    likeCount: {
        type: Number,
        required: false,
        default: 0
    },
    /** 评论数 */
    reviewCount: {
        type: Number,
        required: false,
        default: 0
    },
    /** 转发数 */
    repostCount: {
        type: Number,
        required: false,
        default: 0
    },
    /** 收藏至书签数 */
    bookmarkCount: {
        type: Number,
        required: false,
        default: 0
    },
    /** 排序参数 */
    sort: {
        type: Object,
        required: false,
        default: () => { return { by: 'CREATE_TIME', direction: 'DESC' } }
    }
})

const state = reactive({
    orderDirection: {
        ASC: { icon: 'vertical_align_top', zh: { CREATE_TIME: '从远到近', HOT_LEVEL: '从低到高', ONLY_OWNER: '从远到近' } },
        DESC: { icon: 'vertical_align_bottom', zh: { CREATE_TIME: '从近到远', HOT_LEVEL: '从高到低', ONLY_OWNER: '从近到远' } }
    },
    orderByOptions: {
        CREATE_TIME: { icon: 'schedule', zh: '按发布时间' },
        HOT_LEVEL: { icon: 'local_fire_department', zh: '按热度' },
        ONLY_OWNER: { icon: 'person', zh: '只看楼主' }
    },
    showSortingMenu: false
})

function selectOrderBy(orderBy) {
    emits('selectOrderBy', orderBy)
    state.showSortingMenu = false
}

function routeTo(name){
    router.replace({name: name})
}
</script>