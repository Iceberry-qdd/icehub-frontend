<template>
    <div>
        <div>
            <div><img class=" w-[38rem] h-[18rem] object-cover object-center" :src="bannerPic" /></div>
            <div><img class="relative top-[-2.5rem] left-[1rem] w-[5rem] h-[5rem] border-[4px] border-white rounded-lg" :src="avatarPic" /></div>
            <div class="flex w-fit flex-row gap-x-2 relative top-[-4rem] right-[-30rem]">
                <div>关注</div>
                <div>私信</div>
            </div>
            <div class="relative top-[-3.5rem] flex flex-col gap-y-1 pl-[1rem]">
                <div class="text-[18pt] font-bold">{{ state.user.nickname }}</div>
                <div class="">{{ state.user.remark }}</div>
                <div class="">
                    <span>🎈</span> {{ formattedDate }}
                </div>
                <div v-if="state.user.verified == true" class="">
                    <span>🥈</span>{{ state.user.verifiedInfo }}
                </div>
                <div v-if="state.user.city != null">
                    <span>💎</span>{{ state.user.city }}
                </div>
                <div class="flex flex-row gap-x-4">
                    <div>订阅者 <span>{{ state.user.followedCount }}</span></div>
                    <div>订阅 <span>{{ state.user.followerCount }}</span></div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>

<script setup>
import { reactive, computed } from 'vue';

const props = defineProps(['user'])

const state = reactive({
    user: props.user
})

const formattedDate = computed(() => {
    const timestamps = state.user.createdTime
    const date = new Date(Number.parseInt(timestamps))
    return `${date.getFullYear()}年${date.getMonth()}月${date.getDate()}日`
})

const bannerPic = computed(() => {
    const bannerUrl = state.user.bannerUrl
    // if (bannerUrl == null) return '/src/assets/default-bg.jpg'
    // else
     return bannerUrl ||'/src/assets/default-bg.jpg'
})

const avatarPic = computed(() => {
    if (!state.user.avatarUrl) {
        return `https://api.multiavatar.com/${state.user.nickname}.svg`
    } else {
        return props.post.user.avatarUrl
    }
})

</script>