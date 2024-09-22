<template>
    <div id="setting-data-and-privacy">
        <Header
            class="sticky"
            :width="state.headerConfig.width"
            :title="state.headerConfig.title"
            :go-back="state.headerConfig.goBack"
            :show-menu="state.headerConfig.showMenu"
            :menu-icon="state.headerConfig.menuIcon"
            :no-border="state.headerConfig.noBorder">
        </Header>
        <div>
            <ProfileLock
                :locked="state.setting.profileLock.locked"
                @toggle="state.setting.profileLock.locked = !state.setting.profileLock.locked">
            </ProfileLock>
            <FanListLock
                :visibility="state.setting.fanFollowListLock.fanVisibility"
                :ui="state.setting.fanFollowListLock.options"
                @select="(visibility) => state.setting.fanFollowListLock.fanVisibility = visibility">
            </FanListLock>
            <FollowListLock
                :visibility="state.setting.fanFollowListLock.followVisibility"
                :ui="state.setting.fanFollowListLock.options"
                @select="(visibility) => state.setting.fanFollowListLock.followVisibility = visibility">
            </FollowListLock>
            <Blacklist
                @click="emits('routeTo', 'blacklist')">
            </Blacklist>
            <ExportData></ExportData>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue'
import Header from '@/indexApp/components/Header.vue'
import ProfileLock from '@/indexApp/components/setting/dataPrivacy/ProfileLock.vue'
import FanListLock from '@/indexApp/components/setting/dataPrivacy/FanListLock.vue'
import FollowListLock from '@/indexApp/components/setting/dataPrivacy/FollowListLock.vue'
import Blacklist from '@/indexApp/components/setting/dataPrivacy/Blacklist.vue'
import ExportData from '@/indexApp/components/setting/dataPrivacy/ExportData.vue'

const emits = defineEmits(['routeTo'])
const state = reactive({
    headerConfig: {
        title: '数据与隐私',
        goBack: false,
        showMenu: false,
        menuIcon: undefined,
        noBorder: false
    },
    setting: {
        profileLock: {
            locked: true
        },
        fanFollowListLock: {
            fanVisibility: 'PUBLIC',
            followVisibility: 'PUBLIC',
            options: [
                { id: 1, name: '公开', code: 'PUBLIC', icon: 'public' },
                { id: 2, name: '仅粉丝可见', code: 'ONLY_FOLLOWER', icon: 'person' },
                { id: 3, name: '仅我关注的人可见', code: 'ONLY_FOLLOWING', icon: 'vpn_lock' },
                { id: 4, name: '仅互相关注者可见', code: 'ONLY_CO_FOLLOWER', icon: 'people' },
                // { id: 5, name: '指定用户可见', code: 'ONLY_SPECIFIED' },
                { id: 6, name: '仅自己可见', code: 'ONLY_SELF', icon: 'lock' },
            ],
        }
    }
})
</script>