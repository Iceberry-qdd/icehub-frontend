<template>
    <div v-if="isShow" class="z-[100] bg-[#00000044] w-full h-full fixed flex items-center justify-center">
        <div
            class="z-[101] fixed  bg-white shadow-grey-500/50  shadow-lg w-60 h-60 rounded-lg flex flex-col justify-center items-center">
            <div>
                <i class="bi bi-patch-check-fill text-[4rem] text-blue-600"></i>
            </div>
            <div class="text-sm py-4">知识领域达人认证</div>
            <div class="cursor-pointer bg-black px-4 py-2 rounded-full text-white ">了解更多</div>
        </div>
        <i @click="close" class="cursor-pointer bi bi-x-circle-fill text-black z-[102] relative text-lg -top-[7.5rem] left-[7.5rem]"></i>
    </div>

</template>

<style scoped>

</style>

<script>
export default {
    data() {
        return {
            isShow:false
        }
    },
    methods: {
        close(){
            this.isShow=false
        }
    },
    computed: {

    }
}
</script>