<template>
    <div
        class="cursor-pointer flex flex-row gap-x-2 hover:bg-helper items-center justify-start max-sm:px-3 px-4 py-2 text-[0.85rem]">
        <span
            :class="{'active': props.activity.isActive}"
            class="bg-border dark:bg-primaryContainer device-icon flex-0 material-symbols-rounded no-hover relative text-[1.25rem]">
            {{ state.deviceIconMap.get(props.activity.device.type) }}
        </span>
        <div class="flex-1">
            <div class="font-bold text-[0.9rem]">{{ props.activity.device.name }}</div>
            <div class="text-neutral-400">
                <span>{{ props.activity.ip.country }}</span>
                ·
                <span>{{ props.activity.ip.province }}</span>
            </div>
        </div>
        <div class="flex-0 max-sm:hidden text-neutral-400">
            {{ standardDateTime(props.activity.timestamp) }}
        </div>
    </div>
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
</style>

<script setup>
import { reactive } from 'vue'
import { standardDateTime } from '@/indexApp/utils/formatUtils.js'

const props = defineProps({
    /** 传入的activity对象 */
    activity: {
        type: Object,
        required: true
    }
})

const state = reactive({
    deviceIconMap: new Map([
        ['DESKTOP_WINDOWS', 'desktop_windows'],
        ['DESKTOP_MAC', 'desktop_mac'],
        ['DESKTOP', 'jamboard_kiosk'],
        ['LAPTOP_MAC', 'laptop_mac'],
        ['LAPTOP_CHROMEBOOK', 'laptop_chromebook'],
        ['LAPTOP_WINDOWS', 'laptop_windows'],
        ['LAPTOP', 'computer'],
        ['MOBILE_IPHONE', 'phone_iphone'],
        ['MOBILE_ANDROID', 'phone_android'],
        ['MOBILE', 'smartphone'],
        ['TABLET_MAC', 'tablet_mac'],
        ['TABLET_ANDROID', 'tablet_android'],
        ['TABLET', 'tablet'],
        ['WATCH', 'watch'],
        ['UNKNOWN', 'devices'],
        [undefined, 'devices']
    ])
})
</script>