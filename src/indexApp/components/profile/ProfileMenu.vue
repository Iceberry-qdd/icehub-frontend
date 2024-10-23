<template>
    <div
        id="profile-menu"
        class="bg-white cursor-pointer dark:bg-[#1e1e1e] flex flex-col">
        <div class="flex h-6 items-center justify-center rounded-t-[0.75rem] sm:hidden">
            <div class="bg-gray-200 dark:bg-neutral-700 h-[0.35rem] rounded-full w-12" />
        </div>
        <div class="flex flex-col max-sm:grid max-sm:grid-cols-4 max-sm:place-items-center">
            <ProfileChangeAction
                v-if="state.actionVisMap.get('ProfileChangeAction')"
                class="action first:rounded-t-[8px] last:rounded-b-[8px]">
            </ProfileChangeAction>
    
            <CalendarSearchAction
                v-if="state.actionVisMap.get('CalendarSearchAction')"
                class="action first:rounded-t-[8px] last:rounded-b-[8px]">
            </CalendarSearchAction>
    
            <ShareAction
                v-if="state.actionVisMap.get('ShareAction')"
                :link="generateLink"
                type="USER"
                class="action first:rounded-t-[8px] last:rounded-b-[8px]">
            </ShareAction>
    
            <VerifyApplyAction
                v-if="state.actionVisMap.get('VerifyApplyAction')"
                class="action first:rounded-t-[8px] last:rounded-b-[8px]">
            </VerifyApplyAction>

            <BookmarkAction
                v-if="state.actionVisMap.get('BookmarkAction')"
                class="action first:rounded-t-[8px] last:rounded-b-[8px]">
            </BookmarkAction>
    
            <ProfileBlockAction
                v-if="state.actionVisMap.get('ProfileBlockAction')"
                :user="props.user"
                class="action first:rounded-t-[8px] last:rounded-b-[8px]">
            </ProfileBlockAction>

            <RemoveFanAction
                v-if="state.actionVisMap.get('RemoveFanAction')"
                :fan-id="props.user.id"
                class="action first:rounded-t-[8px] last:rounded-b-[8px]">
            </RemoveFanAction>

            <SettingAction
                v-if="props.user.id === curUser.id && store.MOBILE_MODE"
                class="action first:rounded-t-[8px] last:rounded-b-[8px]">
            </SettingAction>
        </div>
    </div>
</template>

<style scoped>
.action{
    padding: 0.5rem 0.75rem;
    width: 100%;
    text-align: start;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    column-gap: 0.75rem;
    user-select: none;
}

.action:hover{
    background-color: #f3f4f6;
}

.action:hover:where([theme="dark"], [theme="dark"] *){
    background-color: #262626;
}

.action:active{
    background-color: rgb(229 231 235 / var(--tw-bg-opacity));
}

.action:active:where([theme="dark"], [theme="dark"] *){
    background-color: #404040;
}

@media not all and (min-width: 640px) {
    .action{
        padding: 0.5rem 0;
        width: auto;
        flex-direction: column;
        row-gap: 0.5rem;
        width: 100%;
    }

    .action:hover{
        background-color: transparent;
    }

    .action:active{
        background-color: transparent;
    }
}
</style>

<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<script setup>
import { computed, reactive, onMounted, onUnmounted, inject, watch } from 'vue'
import ProfileChangeAction from '@/indexApp/components/menus/userProfileMenus/ProfileChangeAction.vue'
import CalendarSearchAction from '@/indexApp/components/menus/userProfileMenus/CalendarSearchAction.vue'
import ShareAction from '@/indexApp/components/menus/common/ShareAction.vue'
import VerifyApplyAction from '@/indexApp/components/menus/userProfileMenus/VerifyApplyAction.vue'
import ProfileBlockAction from '@/indexApp/components/menus/userProfileMenus/ProfileBlockAction.vue'
import BookmarkAction from '@/indexApp/components/menus/userProfileMenus/BookmarkAction.vue'
import RemoveFanAction from '@/indexApp/components/menus/userProfileMenus/RemoveFanAction.vue'
import SettingAction from '@/indexApp/components/menus/userProfileMenus/SettingAction.vue'
import { store } from '@/indexApp/js/store.js'

const { dismissProfileMenus } = inject('dismissProfileMenus')
const showUnImpl = JSON.parse(import.meta.env.VITE_SHOW_UNFINISHED)
const curUser = JSON.parse(localStorage.getItem("CUR_USER"))
const props = defineProps({
    /** 用户对象 */
    user: {
        type: Object,
        required: true
    }
})

const state = reactive({
    actionVisMap: new Map([
        [ProfileChangeAction.__name, props.user.id === curUser.id],
        [CalendarSearchAction.__name, !props.user.blocking && !props.user.blocked && showUnImpl],
        [ShareAction.__name, !props.user.blocking && !props.user.blocked],
        [VerifyApplyAction.__name, props.user.id === curUser.id && showUnImpl],
        [ProfileBlockAction.__name, props.user.id !== curUser.id],
        [BookmarkAction.__name, props.user.id === curUser.id && store.MOBILE_MODE],
        [RemoveFanAction.__name, props.user.id !== curUser.id && props.user.yourFanStatus === 'FAN'],
        [SettingAction.__name, props.user.id === curUser.id && store.MOBILE_MODE], // TODO BookmarkAction会随着响应式变化，而此处却不变化
        [undefined, false] // 最后设置一个{undefined: false} 保证名字匹配不上时默认不显示
    ])
})

const generateLink = computed(() => {
    return window.location.href
})

function handleProfileMenusDismiss(event) {
    const profileMenus = document.querySelector('#profile-menu')
    const showPostMenusBtn = document.querySelector('#header-opt')
    if (!profileMenus || (!profileMenus.contains(event.target) && !showPostMenusBtn.contains(event.target))) {
        dismissProfileMenus()
    }
    event.stopPropagation()
}

watch(() => store.MOBILE_MODE, (newVal, _) => {
    state.actionVisMap.set(BookmarkAction.__name, newVal)
})

onMounted(() => {
    document.addEventListener('click', handleProfileMenusDismiss)
})

onUnmounted(() => {
    document.removeEventListener('click', handleProfileMenusDismiss)
})
</script>