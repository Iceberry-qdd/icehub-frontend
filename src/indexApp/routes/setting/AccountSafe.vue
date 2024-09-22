<template>
    <div id="setting-account-and-safe">
        <Header
            class="sticky"
            :title="state.headerConfig.title"
            :go-back="state.headerConfig.goBack"
            :show-menu="state.headerConfig.showMenu"
            :menu-icon="state.headerConfig.menuIcon"
            :no-border="state.headerConfig.noBorder">
        </Header>
        <div>
            <LookupProfile></LookupProfile>
            <ChangePwd></ChangePwd>
            <ChangeEmail
                :old-email="state.setting.changeEmail.oldEmail">
            </ChangeEmail>
            <TwoFA
                :checked="state.setting.twoFA.checked"
                @toggle="state.setting.twoFA.checked = !state.setting.twoFA.checked">
            </TwoFA>
            <AccountActivity @click="emits('routeTo', 'accountActivity')"></AccountActivity>
            <Logout></Logout>
            <DeleteAccount class="text-red-500"></DeleteAccount>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue'
import Header from '@/indexApp/components/Header.vue'
import ChangePwd from '@/indexApp/components/setting/accountSafe/ChangePwd.vue'
import LookupProfile from '@/indexApp/components/setting/accountSafe/LookupProfile.vue'
import TwoFA from '@/indexApp/components/setting/accountSafe/TwoFA.vue'
import ChangeEmail from '@/indexApp/components/setting/accountSafe/ChangeEmail.vue'
import Logout from '@/indexApp/components/setting/accountSafe/Logout.vue'
import DeleteAccount from '@/indexApp/components/setting/accountSafe/DeleteAccount.vue'
import AccountActivity from '@/indexApp/components/setting/accountSafe/AccountActivity.vue'

const emits = defineEmits(['routeTo'])
const state = reactive({
    headerConfig: {
        title: '账号与安全',
        goBack: false,
        showMenu: false,
        menuIcon: undefined,
        noBorder: false
    },
    setting: {
        enableNativeNotify: false,
        twoFA: {
            checked: false,
            qrCode: undefined
        },
        changeEmail: {
            oldEmail: 'abcdefg@foxmail.com'
        }
    }
})
</script>