<template>
    <details>
        <summary class="cursor-pointer flex gap-x-2 hover:bg-helper items-center justify-start max-sm:top-[48px] outline-none p-2 sticky text-[0.85rem] top-[56px]">
            <span
                :class="{'active': props.active && status, 'failed': !props.active && !status}"
                class="bg-border dark:bg-primaryContainer device-icon flex-none material-symbols-rounded no-hover relative text-[1.25rem]">
                {{ deviceIconMap.get(osName?.toLocaleUpperCase()) }}
            </span>
            <div class="flex-1">
                <div class="font-bold text-[0.9rem]">
                    {{ `通过 ${loginMethodMap.get(loginMethod)} ${typeMap.get(type)}` }}
                </div>
                <div
                    v-if="!!location"
                    class="text-neutral-400">
                    在 {{ location }}
                </div>
            </div>
            <div class="flex-none justify-items-end max-sm:hidden text-neutral-400">
                <div>{{ standardDateTime(timestamp) }}</div>
                <div>{{ operateResult }}</div>
            </div>
            <IconDown
                :size="20"
                :stroke-width="2">
            </IconDown>
        </summary>
        <div class="gap-2 grid grid-cols-2 max-sm:grid-cols-1">
            <div
                v-for="(item, idx) in state.details"
                :key="idx"
                class="flex gap-x-2 items-start max-sm:active:bg-helper p-2">
                <span class="cursor-default material-symbols-rounded no-hover text-[1.25rem]">
                    {{ item.icon }}
                </span>
                <div>
                    <div class="cursor-default text-[0.85rem] text-neutral-400">
                        {{ item.title }}
                    </div>
                    <div class="text-[0.9rem]">
                        {{ item.value }}
                    </div>
                </div>
            </div>
        </div>
    </details>
</template>

<style scoped>
.device-icon.active::after{
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 0.45rem;
    height: 0.45rem;
    border-radius: 9999px;
    border: 3px solid white;
    box-sizing: content-box;
    background-color: #22c55e;
}

.device-icon.failed::after{
    content: '\00d7';
    position: absolute;
    bottom: 0;
    right: 0;
    font-size: 1rem;
    color: red;
    font-weight: bold;
}

details summary::-webkit-details-marker{
    display: none;
}

details[open] svg[class~="m-icon"]{
    rotate: 0.5turn;
}

details[open]>summary{
    background-color: rgb(var(--color-helper));
}
</style>

<script setup>
import { computed, reactive } from 'vue'
import { standardDateTime } from '@/indexApp/utils/formatUtils.js'
import IconDown from '@/components/icons/IconDown.vue'

const props = defineProps({
    /** 活动实体 */
    activity: {
        type: Object,
        required: true
    },
    /** 是否为正在活动条目 */
    active: {
        type: Boolean,
        required: false,
        default: false
    }
})

// eslint-disable-next-line vue/no-setup-props-reactivity-loss
const {
    ua: {
        device: { type: deviceType = '未知', vendor: deviceVendor = '', model: deviceModel = '' },
        browser: { name: browserName = '其它浏览器', version: browserVersion = '' },
        os: { name: osName = '未知操作系统', version: osVersion = '' },
        cpu: { architecture: cpu = '未知' },
        engine: { name: engineName = '未知', version: engineVersion = '' }
    },
    location,
    createdTime: timestamp,
    userAgent: ua = '未知',
    status,
    statusText,
    loginMethod,
    type,
} = props.activity

const deviceIconMap = new Map([
    ['DESKTOP_WINDOWS', 'desktop_windows'],
    ['WINDOWS', 'desktop_windows'],
    ['DESKTOP_MAC', 'desktop_mac'],
    ['MAC', 'desktop_mac'],
    ['MACOS', 'desktop_mac'],
    ['DESKTOP', 'jamboard_kiosk'],
    ['LAPTOP_MAC', 'laptop_mac'],
    ['LAPTOP_CHROMEBOOK', 'laptop_chromebook'],
    ['LAPTOP_WINDOWS', 'laptop_windows'],
    ['LAPTOP', 'computer'],
    ['MOBILE_IPHONE', 'phone_iphone'],
    ['IOS', 'phone_iphone'],
    ['IPHONE', 'phone_iphone'],
    ['MOBILE_ANDROID', 'phone_android'],
    ['ANDROID', 'phone_android'],
    ['MOBILE', 'smartphone'],
    ['TABLET_MAC', 'tablet_mac'],
    ['TABLET_ANDROID', 'tablet_android'],
    ['TABLET', 'tablet'],
    ['WATCH', 'watch'],
    ['UNKNOWN', 'devices'],
    ['未知操作系统', 'devices'],
    [undefined, 'devices'],
    [null, 'devices']
])

const loginMethodMap = new Map([
    ['PASSWORD', '用户名与密码'],
    ['PASSKEY', '通行密钥'],
    ['TOKEN', '令牌'],
    [undefined, '未知方式'],
    [null, '其它方式']
])

const typeMap = new Map([
    ['LOGIN', '登录'],
    ['LOGOUT', '退出登录'],
    ['PASSKEY_CREATED', '创建新的通行密钥'],
    ['PASSKEY_DELETED', '删除通行密钥'],
    ['CONFIRM', '二次验证']
])

const operateResult = computed(() => {
    const pattern = /{[0-9]+}|[!！]/g
    return status ? '操作成功' : statusText.replace(pattern, '')
})

const state = reactive({
    details: [
        { icon: 'function', title: '操作类型', value: typeMap.get(type) },
        { icon: 'info', title: '操作结果', value: operateResult },
        { icon: 'key_vertical', title: '认证方式', value: loginMethodMap.get(loginMethod) },
        { icon: 'schedule', title: '时间', value: standardDateTime(timestamp) },
        { icon: 'location_on', title: '位置', value: location || '未知' },
        { icon: 'language', title: '浏览器', value: `${browserName} ${browserVersion}` },
        { icon: deviceIconMap.get(osName?.toLocaleUpperCase()), title: '操作系统', value: `${osName} ${osVersion}` },
        { icon: deviceIconMap.get(osName?.toLocaleUpperCase()), title: '设备', value: `${deviceType} ${deviceVendor} ${deviceModel}` }
    ]
})
</script>