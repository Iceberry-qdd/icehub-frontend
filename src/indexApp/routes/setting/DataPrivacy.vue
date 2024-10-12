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
            <div
                v-if="showUnImpl">
                <BaseVisibilitySelector
                    v-for="(item, key) in state.setting.visibility"
                    :key="key"
                    :visibility="state.setting.visibility[key].value"
                    :ui="state.setting.visibilityOptions"
                    :title="item.title"
                    :desc="item.desc"
                    :type="key"
                    @select="({type, value}) => state.setting.visibility[type].value=value">
                </BaseVisibilitySelector>
            </div>
            <Blacklist @click="emits('routeTo', 'blacklist')"></Blacklist>
            <ExportData v-if="showUnImpl"></ExportData>
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
import BaseVisibilitySelector from '@/indexApp/components/setting/dataPrivacy/BaseVisibilitySelector.vue'

const showUnImpl = JSON.parse(import.meta.env.VITE_SHOW_UNFINISHED)
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
            locked: JSON.parse(localStorage.getItem("CUR_USER")).confirmFollow
        },
        visibility: {
            fanVisibility: {value: 'PUBLIC', title: '谁可以查看我的粉丝列表', desc: '选择哪些用户可以查看我的粉丝列表。'},
            followVisibility: {value: 'PUBLIC', title: '谁可以查看我的关注列表', desc: '选择哪些用户可以查看我的关注列表。'},
            likeVisibility: {value: 'PUBLIC', title: '谁可以查看我的点赞列表', desc: '选择哪些用户可以查看我的点赞列表。'},
            reviewVisibility: {value: 'PUBLIC', title: '谁可以查看我的评论列表', desc: '选择哪些用户可以查看我的评论列表。'}
        },
        visibilityOptions: [
            { id: 1, name: '公开', code: 'PUBLIC', icon: 'public' },
            { id: 2, name: '仅粉丝可见', code: 'ONLY_FOLLOWER', icon: 'person' },
            { id: 3, name: '仅我关注的人可见', code: 'ONLY_FOLLOWING', icon: 'vpn_lock' },
            { id: 4, name: '仅互相关注者可见', code: 'ONLY_CO_FOLLOWER', icon: 'people' },
            // { id: 5, name: '指定用户可见', code: 'ONLY_SPECIFIED' },
            { id: 6, name: '仅自己可见', code: 'ONLY_SELF', icon: 'lock' },
        ]
    }
})
</script>