<template>
    <div
        id="profile-menu"
        class="bg-white cursor-pointer flex flex-col max-w-[18rem] min-w-[10rem] ring-1 ring-slate-900/5 rounded-[8px] shadow-lg">
        <ProfileChangeAction
            v-if="state.actionVisMap.get('ProfileChangeAction')"
            class="active:bg-gray-200 first:rounded-t-[8px] hover:bg-gray-100 last:rounded-b-[8px] px-[0.75rem] py-[0.5rem]">
        </ProfileChangeAction>

        <CalendarSearchAction
            v-if="state.actionVisMap.get('CalendarSearchAction')"
            class="active:bg-gray-200 first:rounded-t-[8px] hover:bg-gray-100 last:rounded-b-[8px] px-[0.75rem] py-[0.5rem]">
        </CalendarSearchAction>

        <ShareLinkAction
            v-if="state.actionVisMap.get('ShareLinkAction')"
            :link="generateLink"
            class="active:bg-gray-200 first:rounded-t-[8px] hover:bg-gray-100 last:rounded-b-[8px] px-[0.75rem] py-[0.5rem]">
        </ShareLinkAction>

        <VerifyApplyAction
            v-if="state.actionVisMap.get('VerifyApplyAction')"
            class="active:bg-gray-200 first:rounded-t-[8px] hover:bg-gray-100 last:rounded-b-[8px] px-[0.75rem] py-[0.5rem]">
        </VerifyApplyAction>

        <ProfileLockAction
            v-if="state.actionVisMap.get('ProfileLockAction')"
            class="active:bg-gray-200 first:rounded-t-[8px] hover:bg-gray-100 last:rounded-b-[8px] px-[0.75rem] py-[0.5rem]">
        </ProfileLockAction>

        <ProfileBlockAction
            v-if="state.actionVisMap.get('ProfileBlockAction')"
            :user="props.user"
            class="active:bg-gray-200 first:rounded-t-[8px] hover:bg-gray-100 last:rounded-b-[8px] px-[0.75rem] py-[0.5rem]">
        </ProfileBlockAction>

        <LogoutAction
            v-if="state.actionVisMap.get('LogoutAction')"
            class="active:bg-gray-200 first:rounded-t-[8px] hover:bg-gray-100 last:rounded-b-[8px] px-[0.75rem] py-[0.5rem]">
        </LogoutAction>
    </div>
</template>

<style scoped>

</style>

<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<script setup>
import ProfileChangeAction from '@/indexApp/components/menus/UserProfileMenus/ProfileChangeAction.vue'
import CalendarSearchAction from '@/indexApp/components/menus/UserProfileMenus/CalendarSearchAction.vue'
import ShareLinkAction from '@/indexApp/components/menus/UserProfileMenus/ShareLinkAction.vue'
import VerifyApplyAction from '@/indexApp/components/menus/UserProfileMenus/VerifyApplyAction.vue'
import ProfileLockAction from '@/indexApp/components/menus/UserProfileMenus/ProfileLockAction.vue'
import LogoutAction from '@/indexApp/components/menus/UserProfileMenus/LogoutAction.vue'
import ProfileBlockAction from '@/indexApp/components/menus/UserProfileMenus/ProfileBlockAction.vue'
import { computed, reactive, onMounted, onUnmounted, inject } from 'vue'

const { dismissProfileMenus } = inject('dismissProfileMenus')
const showUnImpl = JSON.parse(import.meta.env.VITE_SHOW_UNFINISHED)
const props = defineProps({
    /** 用户对象 */
    user: {
        type: Object,
        required: true
    }
})

const curUser = JSON.parse(localStorage.getItem("CUR_USER"))

const state = reactive({
    actionVisMap: new Map([
        [ProfileChangeAction.__name, props.user.id === curUser.id],
        [CalendarSearchAction.__name, !props.user.blocking && !props.user.blocked && showUnImpl],
        [ShareLinkAction.__name, !props.user.blocking && !props.user.blocked],
        [VerifyApplyAction.__name, props.user.id === curUser.id && showUnImpl],
        [ProfileLockAction.__name, props.user.id === curUser.id && showUnImpl],
        [ProfileBlockAction.__name, props.user.id !== curUser.id],
        [LogoutAction.__name, props.user.id === curUser.id],
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

onMounted(() => {
    document.querySelector('#app').addEventListener('click', handleProfileMenusDismiss)
})

onUnmounted(() => {
    document.querySelector('#app').removeEventListener('click', handleProfileMenusDismiss)
})
</script>