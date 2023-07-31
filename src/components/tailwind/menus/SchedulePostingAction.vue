<template>
    <div class="card-container shadow ring-1 ring-slate-900/5">
        <div class="flex flex-row text-[#606266] text-[10pt]">
            <div class="date-picker">
                <div class="flex pb-2 w-[calc(100%+9.5rem)] translate-x-[calc(9.5rem/2)] flex-row flex-nowrap justify-between items-center">
                    <div class="text-[11pt] text-[#409EFF] cursor-pointer">清除</div>
                    <div class="text-[11pt]">2023-07-23 10:44:38</div>
                    <div class="text-[11pt] text-[#409EFF] cursor-pointer">确定</div>
                </div>

                <div class="flex flex-row w-full h-[2rem] justify-around items-center">
                    <div>&lt;&lt;</div>
                    <div>&lt;</div>
                    <div class="text-[11pt] font-bold">2023</div>
                    <div>&gt;</div>
                    <div>&gt;&gt;</div>
                </div>
                <div class="divide-y  cursor-default">
                    <div class="grid grid-cols-7 gap-1">
                        <div class=" p-1  w-[2.5rem] h-[2.5rem]  flex justify-center items-center">一</div>
                        <div class=" p-1  w-[2.5rem] h-[2.5rem]  flex justify-center items-center">二</div>
                        <div class=" p-1  w-[2.5rem] h-[2.5rem]  flex justify-center items-center">三</div>
                        <div class=" p-1  w-[2.5rem] h-[2.5rem]  flex justify-center items-center">四</div>
                        <div class=" p-1  w-[2.5rem] h-[2.5rem]  flex justify-center items-center">五</div>
                        <div class=" p-1  w-[2.5rem] h-[2.5rem]  flex justify-center items-center">六</div>
                        <div class=" p-1  w-[2.5rem] h-[2.5rem]  flex justify-center items-center">日</div>
                    </div>
                    <div
                        class="absolute flex justify-center items-center w-[calc(100%-2rem-2rem-2rem-3rem)] h-[calc(100%-2rem-2.5rem-0.75rem-3.75rem)] -translate-x-[0.75rem] text-[96pt] text-[#cfe2ff] -z-[1]">
                        7</div>
                    <div class="grid grid-cols-7 gap-1 pt-2 cursor-pointer">
                        <div v-for="i in 30"
                            class="hover:bg-[#cfe2ff] active:bg-[#cfe2ff] rounded-full w-[2.5rem] h-[2.5rem]  flex justify-center items-center">
                            {{ i }}
                        </div>
                    </div>
                </div>

            </div>
            <div class="w-[9.5rem]"></div>
            <div class="time-picker flex flex-row top-0 translate-x-[20.5rem] translate-y-[2.75rem] h-[calc(100%-2.75rem)] cursor-n-resize">
                <div
                    class="overflow-y-scroll overflow-x-hidden  w-[3rem] h-full text-[10pt] flex flex-col divide-y">
                    <div class="w-full h-full py-1 flex flex-row flex-nowrap justify-center items-center" v-for="i in 24">{{ i - 1 }}</div>
                </div>
                <div class="overflow-y-scroll overflow-x-hidden w-[3rem] h-full text-[10pt] flex flex-col divide-y">
                    <div class="w-full h-full py-1 flex flex-row flex-nowrap justify-center items-center" v-for="i in 60">{{ i - 1 }}</div>
                </div>
                <div class="overflow-y-scroll overflow-x-hidden w-[3rem] h-full text-[10pt] flex flex-col divide-y">
                    <div class="w-full h-full py-1 flex flex-row flex-nowrap justify-center items-center" v-for="i in 60">{{ i - 1 }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card-container {
    z-index: 99;
    position: absolute;
    top: 2.5rem;
    min-width: max-content;
    min-height: max-content;
    background-color: white;
    border-radius: 6px;
}

.date-picker {
    display: flex;
    flex-direction: column;
    justify-content: left;
    align-items: center;
    padding: 0.75rem 0.75rem 0 0.75rem;
    /* cursor: pointer; */
}

.time-picker {
    z-index: 99;
    position: absolute;
    top: 0rem;
    min-width: max-content;
    min-height: max-content;
    background-color: white;
    border-radius: 6px;
}

.scrollbar-hidden {
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* IE 10+ */
}

::-webkit-scrollbar {
    display: none;
    /* Chrome Safari */
}
</style>

<script setup>

</script>