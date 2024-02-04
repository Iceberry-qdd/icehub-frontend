<template>
    <div>
        <div id="h" class="flex flex-row justify-between text-[15pt] items-center px-[1rem] w-[calc(100%*5/13)]"
            :class="[!state.noBorder ? 'border-btm' : '']">
            <div class="text-[15pt] h-full flex flex-row items-center">
                <div @click="routeBackTo" v-if="props.goBack" v-tooltip:full="'返回'"
                    class="material-icons-round cursor-pointer text-[14pt] mr-[0.5rem]">
                    arrow_back_ios
                </div>
                <div class="text-[14pt] font-bold">{{ props.title }}</div>
            </div>
            <div v-tooltip:quarter="props.iconTooltip" v-if="props.showMenu">
                <span
                    v-if="props.menuIcon"
                    @click="handleAction"
                    class="material-icons-round text-[14pt]">
                    {{ props.menuIcon }}
                </span>
            </div>
        </div>
        <div id="h-hide"></div>
    </div>
</template>

<style scoped>
#h {
    background-color: rgb(255 255 255 / 84%);
    backdrop-filter: blur(25px);
    z-index: 104;
    height: 56px;
    position: fixed;
}

.border-btm {
    border-bottom: 1px solid #EEEEEE;
}

#h-hide {
    width: 1px;
    height: 56px;
}
</style>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps(['title', 'goBack', 'showMenu', 'menuIcon', 'menuAction','iconTooltip','width','noBorder'])
const emits = defineEmits(['handleAction'])
const state = reactive({
    routeUrl: '/',
    editIcon: '',
    url: window.location.href,
    submit: false,
    noBorder: props.noBorder != null ? props.noBorder : false
})


function handleAction() {
    emits('handleAction')
}

function routeBackTo() {
    router.back()
}

</script>