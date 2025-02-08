<template>
    <div class="flex flex-col gap-y-4 items-center text-[0.85rem] text-neutral-700">
        <div
            id="banner"
            class="aspect-[2/1] bg-auto bg-center bg-no-repeat rounded-lg w-full" />
        <div class="gap-2 grid grid-cols-3 intro max-sm:grid-cols-2">
            <div
                v-for="intro in state.intros"
                :key="intro.id"
                class="bg-gray-50 dark:bg-helper dark:text-white/50 p-2 rounded-lg">
                {{ intro.text }}
                <a
                    v-if="!!intro.link"
                    :href="intro.link?.href"
                    target="PasskeyWeb"
                    rel="noopener noreferrer"
                    class="dark:text-onPrimary text-primary">
                    {{ intro.link?.text }}
                </a>
            </div>
        </div>
        <button
            type="button"
            :class="{'bg-primaryContainer': !state.loading, 'bg-primaryContainer-disable cursor-not-allowed': state.loading}"
            class="bottom-4 dark:text-onPrimary leading-10 min-w-40 rounded-full sticky text text-primary"
            @click="createPasskey">
            <IconLoading
                v-if="state.loading"
                class="box-content h-5 justify-self-center py-[0.6rem] text-inherit w-5">
            </IconLoading>
            <div
                v-if="!state.loading"
                id="add-passkey-icons-wrapper"
                class="align-middle h-[1.1rem] inline-block mr-1 overflow-hidden text-[1.1rem]">
                <span
                    v-for="(icon, index) in state.supportMethodsIcon"
                    :key="index"
                    class="material-symbols-rounded no-hover">
                    {{ icon }}
                </span>
            </div>
            <span v-if="!state.loading">添加通行密钥</span>
        </button>
    </div>
</template>

<style scoped>
#passkey-create-dialog .intro {
    grid-template-columns: repeat(2, minmax(0, 1fr));
}

#banner {
    background-image: url("/passkey_challenge.svg"), linear-gradient(to right, #C6EDFFAA, #A3C6FFAA);
}

#banner:where([theme="dark"], [theme="dark"] *) {
    background-image: url("/passkey_challenge.svg");
    background-color: rgb(var(--color-helper));
}

#add-passkey-icons-wrapper>span[class~="material-symbols-rounded"] {
    display: block;
    font-size: inherit;
    color: inherit;
    padding: 0;
    animation: count 4s steps(4, jump-end) infinite;
}

@keyframes count {
    0% {
        transform: translateY(0);
    }

    100% {
        transform: translateY(-4.4rem);
    }
}
</style>

<script setup>
import { reactive } from 'vue'
import IconLoading from '@/components/icons/IconLoading.vue'

const state = reactive({
    intros: [
        { id: 1, text: '🔑 使用通行密钥(Passkey)作为登录凭据，可以有效防止网络钓鱼、撞库和其他远程攻击。', link: { text: '了解更多', href: 'https://fidoalliance.org/passkeys-2' } },
        { id: 2, text: '🎯 借助通行密钥，用户可以使用生物识别传感器（例如指纹或人脸识别）、PIN 码或图案登录应用和网站。', link: undefined },
        { id: 3, text: '📲 创建并注册通行密钥后，用户可以无缝切换到新设备，并立即使用该设备，而无需重新注册。', link: undefined },
        { id: 4, text: '🏗 通行密钥旨在通过操作系统基础架构使用，该基础架构可让通行密钥管理器创建、备份密钥。', link: undefined },
        { id: 5, text: '🔌 通行密钥可以跨端使用，不论是APP、网页均可共享同一套通行密钥。', link: undefined },
        { id: 6, text: '📠 支持使用通行密钥作为敏感操作前的验证步骤，比如修改电子邮件地址、密码、支付等。', link: undefined }
    ],
    supportMethodsIcon: ['fingerprint', 'pattern', 'ar_on_you', 'ads_click'],
    loading: false
})

// TODO
function createPasskey() {
    if (state.loading === true) return

    state.loading = true
}
</script>