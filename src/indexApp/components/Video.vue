<template>
    <div
        ref="containerRef"
        data-shaka-player-container>
        <!-- eslint-disable-next-line vue/html-self-closing -->
        <video
            ref="videoRef"
            data-shaka-player
            :poster="posterUrl">
        </video>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, onBeforeUnmount, onActivated, onDeactivated } from 'vue'
import 'shaka-player/dist/controls.css'
import * as shaka from 'shaka-player/dist/shaka-player.ui.debug'
import { store } from '@/indexApp/js/store.js'

const BASE_API_URL = import.meta.env.VITE_API_BASE_URL
const BASE_IMAGE_URL = import.meta.env.VITE_IMAGE_BASE_URL
const BASE_VIDEO_URL = import.meta.env.VITE_VIDEO_BASE_URL
const containerRef = ref()
const videoRef = ref()

const props = defineProps({
    /** 媒体描述文件链接 */
    manifestUrl: {
        type: String,
        required: true
    },
    /** 视频预览图链接 */
    poster: {
        type: String,
        required: false,
        default: ''
    },
    /** 视频id */
    videoId:{
        type: String,
        required: true
    },
    /** 是否显示视频控制选项 */
    showControls: {
        type: Boolean,
        required: false,
        default: false
    }
})

const state = reactive({
    player: undefined,
    state: undefined,
    pausedByObserver: false,
    uiConfig: {
        'enableTooltips': true,
        'customContextMenu': true,
        'contextMenuElements': ['statistics'],
        'statisticsList': ['width', 'height', 'playTime', 'bufferingTime', 'decodedFrames', 'droppedFrames', 'bytesDownloaded', 'estimatedBandwidth'],
        'seekBarColors': {
            base: 'rgba(255, 255, 255, 0.3)',
            buffered: 'rgba(255, 255, 255, 0.54)',
            played: 'rgb(255,255, 255)',
        },
        'playbackRates': [0.5, 1, 1.25, 1.5, 2],
        'addBigPlayButton': true
    }
})

const manifestUrl = computed(() => {
    return `${BASE_VIDEO_URL}${props.manifestUrl}`
})

const posterUrl = computed(() => {
    return `${BASE_IMAGE_URL}${props.poster}`
})

const controlPanelElements = computed(() => {
    return props.showControls ? ['time_and_duration','SeekBar', 'spacer', 'mute', 'quality', 'playback_rate', 'fullscreen']: ['mute']
})

const options = { root: null, rootMargin: '0px', threshold: 0 }
const videoObserver = new IntersectionObserver((entries) => {
    if (entries[0].intersectionRatio <= options.threshold && state.state === 'playing') {
        videoRef.value.pause()
        state.pausedByObserver = true
        return
    }

    if(entries[0].intersectionRatio > options.threshold && state.pausedByObserver){
        videoRef.value.play()
        state.pausedByObserver = false
    }
}, options)

function onPlayerErrorEvent(event) {
    onPlayerError(event.detail);
}

function onUIErrorEvent(event) {
    onPlayerError(event.detail)
}

function onPlayerError(error) {
    console.error('Error code', error.code, 'object', error);
}

function storeVideoStatus(){
    const {currentTime, paused, muted} = videoRef.value
    store.setVideoPlayStatus(props.videoId, currentTime, !paused, muted)
}

function loadVideoStatus(){
    const {currentTime, playing, mute} = store.getVideoPlayStatus(props.videoId)
    videoRef.value.currentTime = currentTime
    playing ? videoRef.value.play() : videoRef.value.pause()
    videoRef.value.muted = mute
}

onMounted(async () => {
    shaka.polyfill.installAll()
    if (!shaka.Player.isBrowserSupported()) {
        console.error('[shaka]Browser not supported!')
        return
    }

    // 默认静音播放
    videoRef.value.muted = true

    const player = new shaka.Player()
    player.attach(videoRef.value)

    const ui = new shaka.ui.Overlay(player, containerRef.value, videoRef.value)
    ui.configure({
        ...state.uiConfig,
        'controlPanelElements': controlPanelElements.value,
        'addSeekBar': props.showControls
    })
    const controls = ui.getControls()
    controls.setEnabledNativeControls(false)
    controls.setEnabledShakaControls(true)

    // Listen for events.
    player.addEventListener('error', onPlayerErrorEvent)
    controls.addEventListener('error', onUIErrorEvent)
    player.addEventListener('statechanged', ({newstate}) => {
        state.state = newstate
    })

    // 生成正确请求
    player.getNetworkingEngine().registerRequestFilter((type, request) => {
        if (type === shaka.net.NetworkingEngine.RequestType.KEY) {
            request.headers['X-Content-Type'] = 'video/*'
            request.uris = request.uris.map(it => `${BASE_API_URL}/object/video/key/${props.videoId}`)
        }
    })

    try {
        await player.load(manifestUrl.value)
    } catch (error) {
        onPlayerError(error)
    }

    state.player = player
    videoObserver.observe(containerRef.value)
    loadVideoStatus()
})

onActivated(() => {
    loadVideoStatus()
})

onDeactivated(() => {
    storeVideoStatus()
})

onBeforeUnmount(() => {
    videoObserver.unobserve(containerRef.value)
    storeVideoStatus()
})
</script>