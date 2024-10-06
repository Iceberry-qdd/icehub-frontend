<template>
    <div>
        <div
            ref="imageGrid"
            class="3xl:grid-cols-4 gap-x-1 gap-y-1 grid grid-cols-3">
            <ImageItem
                v-for="image in state.medias"
                :id="image.id"
                :key="image.id"
                :type-id="image.fromId"
                :image="image.media"
                :index="image.fromIndex"
                :type="image.from.toLowerCase()"
                :aspect-ratio="1"
                @real-image="({ id, image: media }) => state.medias.find(it => it.id === id).media = media">
            </ImageItem>
        </div>
        <Footer
            :is-loading="state.isLoading"
            :has-more="hasMore"
            @fetch-more="getMedias">
        </Footer>
    </div>
</template>

<script setup>
import { reactive, computed, watch, onMounted, ref } from 'vue'
import { store } from '@/indexApp/js/store.js'
import Footer from '@/indexApp/components/Footer.vue'
import { getMediasOfUser } from '@/indexApp/js/api'
import ImageItem from '@/indexApp/components/profile/ImageItem.vue'

const emits = defineEmits(['updateTabCount'])
const imageGrid = ref()
const props = defineProps({
    /** 表明是谁的主页 */
    user: {
        type: Object,
        required: false,
        default: undefined // XXX 实际不应该接收undefined值，但传递过来的值可能为undefined
    },
    /** 表示从哪个tab路由过来的 */
    tabId: {
        type: String,
        required: true
    }
})
const state = reactive({
    curUser: JSON.parse(localStorage.getItem("CUR_USER")),
    medias: [],
    pageIndex: 1,
    pageSize: 10,
    lastTimestamp: Date.now(),
    totalPages: 0,
    totalCount: 0,
    isLoading: true,
})

const hasMore = computed(() => {
    return state.pageIndex < state.totalPages
})

const isPrivateAccountAndNotFollowed = computed(() => {
    return props.user.confirmFollow && props.user.yourFollowStatus !== 'FOLLOW' && state.curUser.id !== props.user.id
})

async function getMedias() {
    try {
        state.isLoading = true
        const response = await getMediasOfUser(props.user.id, state.pageIndex, state.pageSize, state.lastTimestamp, 'POST')
        if (!response.ok) throw new Error((await response.json()).message)

        const { content, totalPages, totalCount } = await response.json()

        const startIdx = getFirstNonDuplicateIndex(content)
        state.medias.push(...content.slice(startIdx))
        state.totalPages = totalPages
        state.totalCount = Math.max(state.totalCount, totalCount)

        if (content.length > 1) {
            state.lastTimestamp = content.slice(-1)[0].createdTime
        }
    } catch (e) {
        store.setErrorMsg(e.message)
    } finally {
        state.isLoading = false
    }
}

/**
 * 从后向前遍历state.medias，同时从前向后遍历content。
 * 若遇到重复的，则不加入；若遇到不重复的，则直接返回该下标。
 * 重复只会发生一次。
 * 如何判断两个元素是否相同，不能通过判断两者的id，而是判断两者的属性'from', 'fromId', 'fromIndex', 'createdTime', 'type'是否均相同
 * 
 * @param {Array<Object>} content 新媒体列表
 * @returns {Number} 第一个不重复的下标
 */
function getFirstNonDuplicateIndex(content) {
    for (let i = state.medias.length - 1; i >= 0; i--) {
        for (let j = 0; j < content.length; j++) {
            const testCondition = ['from', 'fromId', 'fromIndex', 'createdTime', 'type']

            while (testCondition.every(it => state.medias.at(i)[it] === content.at(j)[it])) {
                i--;
                j++;
            }
            return j
        }
    }
    return 0
}

watch(() => state.totalCount, (newVal, _) => {
    emits('updateTabCount', { id: props.tabId, count: newVal })
})

onMounted(async () => {
    if (!props.user) return

    const { lastPostAt, blocked, blocking } = props.user
    state.lastTimestamp = lastPostAt || Date.now()
    if (!blocked && !blocking && !isPrivateAccountAndNotFollowed.value) {
        await getMedias()
    }
})
</script>