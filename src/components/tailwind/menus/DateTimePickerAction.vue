<template>
    <div class="card-container ring-1 ring-slate-900/5">
        <div v-if="props.noteMsg" class="w-full h-[2.5rem] p-3 bg-[#f1f3f4] rounded-lg flex justify-left items-center gap-2 cursor-default">
            <IconInfo class="bg-[#cfe2ff] rounded-full box-content p-[0.1rem]"></IconInfo>
            {{ props.noteMsg }}
        </div>
            <div id="date-picker">
                <div class="flex w-full flex-row flex-nowrap justify-between items-center">
                    <div class="text-[11pt] text-[#409EFF] cursor-pointer" @click = "closeAndClear">清除</div>
                    <div class="text-[11pt]">{{ formattedPickedDateTime }}</div>
                    <div class="text-[11pt] text-[#409EFF] cursor-pointer" @click = "closeAndOk">确定</div>
                </div>

                <div class="flex flex-row w-full h-[2rem] justify-between items-center">
                    <div
                        @click="minusOneYear"
                        :class="[canPickYearBefore ? '' : 'm-disabled']"
                        class="material-icons-round last-year">
                        keyboard_double_arrow_left
                    </div>
                    <div
                        @click="canPickMonthBefore ? minusOneMonth() : ''"
                        :class="[canPickMonthBefore ? '' : 'm-disabled']"
                        class="material-icons-round last-month">
                        keyboard_arrow_left
                    </div>
                    <div class="text-[11pt] font-bold">{{ state.pickedYear }}</div>
                    <div
                        @click="canPickMonthAfter ? addOneMonth() : ''"
                        :class="[canPickMonthAfter ? '' : 'm-disabled']"
                        class="material-icons-round next-month">
                        keyboard_arrow_right
                    </div>
                    <div
                        @click="addOneYear"
                        :class="[canPickYearAfter ? '' : 'm-disabled']"
                        class="material-icons-round next-year">
                        keyboard_double_arrow_right
                    </div>
                </div>
                <div class="divide-y  cursor-default">
                    <div class="grid grid-cols-7 gap-1">
                        <div
                            class="w-[2.5rem] h-[2.5rem] flex justify-center items-center"
                            v-for="(week,index) in state.weekNames" :key="index">
                            {{ week }}
                        </div>
                    </div>
                    <div
                        class="absolute flex justify-center items-center w-full -translate-x-[1rem] h-[calc(100%-2rem-0.75rem-0.5rem-11pt-2rem-1.25rem-16pt-2rem-2.5rem)] text-[96pt] text-[#EBEEF5] -z-[1]">
                        {{ state.pickedMonth }}
                    </div>
                    <div class="grid grid-cols-7 gap-1 pt-2 cursor-pointer">
                        <div
                            v-for="i in startWeekOfPickedMonth - 1"
                            class="rounded-full w-[2.5rem] h-[2.5rem] flex justify-center items-center cursor-default">
                        </div>

                        <div v-for="i in daysCountOfPickedMonth"
                            :class="[state.pickedDate == i ? 'bg-[#c6e2ff] hover:bg-[#c6e2ff]' : 'hover:bg-[#EBEEF5]', canPickThisDay(i) ? '':'m-disabled']"
                            @click="canPickThisDay(i) ? state.pickedDate = i : ''"
                            class="rounded-full w-[2.5rem] h-[2.5rem] flex justify-center items-center">
                            {{ i }}
                        </div>
                    </div>
                </div>
            </div>

            <div id="time-picker">
                <select
                    v-model="state.pickedHour"
                    class="px-4 py-[0.25rem] border-[1px] focus:ring-2 focus-visible:outline-none ring-offset-2 ring-blue-500 rounded-[6px]"
                    required name="hour-picker"
                    id="hour-picker">
                    <option class="text-[11pt] font-normal" v-for="(hour, index) in 24" :value="index">{{ index < 10 ? '0' + index : index }}</option>
                </select>

                <div class="px-4">:</div>

                <select
                    v-model="state.pickedMinute"
                    class="px-4 py-[0.25rem] border-[1px] focus:ring-2 focus-visible:outline-none ring-offset-2 ring-blue-500 rounded-[6px]"
                    required name="minute-picker"
                    id="minute-picker">
                    <option class="text-[11pt] font-normal" v-for="(minute, index) in 60" :value="index">{{ index < 10 ? '0' + index : index }}</option>
                </select>
            </div>

            <!-- 滚轮形式时间选择器，未实现 -->
            <!-- <div class="w-[9.5rem]"></div>
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
            </div> -->
    </div>
</template>

<style scoped>
.material-icons-round{
    cursor: pointer;
    border-radius: 8px;
    font-size: 15pt;
    padding: 0.25rem;
}

.card-container {
    z-index: 99;
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: left;
    align-items: center;
    gap: 0.5rem;
    color:#606266;
    font-size:10pt;
    top: 2.5rem;
    min-width: max-content;
    min-height: max-content;
    background-color: white;
    border:1px solid #EEEEEE;
    border-radius: 6px;
    box-shadow: 1px 1px 4px 2px #00000011;
    padding: 1rem;
}

#time-picker{
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: center;
    align-items: center;
    font-size: 16pt;
    font-weight: bold;
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

.m-disabled{
    color: #C0C4CC;
    cursor: not-allowed;
}

.m-disabled:hover{
    background-color: transparent;
}
</style>

<script setup>
import { computed, reactive, onMounted } from 'vue'
import IconInfo from '@/components/icons/IconInfo.vue'

const props = defineProps(['showTimePicker','showDatePicker','validDateTimeRange','noteMsg', 'curPickedTime'])
const emits = defineEmits(['closeWithOk','closeWithClear'])

const state = reactive({
    showTimePicker: props.showTimePicker,
    showDatePicker: props.showDatePicker,
    weekNames: ['一', '二', '三', '四', '五', '六', '日'],
    pickedYear: 1970,
    pickedMonth: 1,
    pickedDate: 1,
    pickedHour: 8,
    pickedMinute: 0,
    validDateTimeRange: props.validDateTimeRange
})

const formattedPickedDateTime = computed(() => {
    const formattedYear = state.pickedYear
    const formattedMonth = state.pickedMonth < 10 ? `0${state.pickedMonth}` : state.pickedMonth
    const formattedDate = state.pickedDate < 10 ? `0${state.pickedDate}` : state.pickedDate
    const formattedHour = state.pickedHour < 10 ? `0${state.pickedHour}` : state.pickedHour
    const formattedMinute = state.pickedMinute < 10 ? `0${state.pickedMinute}` : state.pickedMinute
    return `${formattedYear}-${formattedMonth}-${formattedDate} ${formattedHour}:${formattedMinute}`
})

const canPickMonthBefore = computed(() => {
    const pickedDate = new Date(state.pickedYear, state.pickedMonth - 1)
    const leftRangeDate = new Date(state.validDateTimeRange[0].getFullYear(), state.validDateTimeRange[0].getMonth())
    return pickedDate > leftRangeDate
})

const canPickMonthAfter = computed(() => {
    const pickedDate = new Date(state.pickedYear, state.pickedMonth - 1)
    const rightRangeDate = new Date(state.validDateTimeRange[1].getFullYear(), state.validDateTimeRange[1].getMonth())
    return pickedDate < rightRangeDate
})

const canPickYearBefore = computed(() => {
    const pickedDate = new Date(state.pickedYear - 1, state.pickedMonth - 1)
    const leftRangeDate = new Date(state.validDateTimeRange[0].getFullYear(), state.validDateTimeRange[0].getMonth())
    return pickedDate > leftRangeDate
})

const canPickYearAfter = computed(() => {
    const pickedDate = new Date(state.pickedYear + 1, state.pickedMonth - 1)
    const rightRangeDate = new Date(state.validDateTimeRange[1].getFullYear(), state.validDateTimeRange[1].getMonth())
    return pickedDate < rightRangeDate
})

const daysCountOfPickedMonth = computed(() => {
    return new Date(state.pickedYear, state.pickedMonth, 0).getDate()
})

const startWeekOfPickedMonth = computed(() =>{
    const weekNo = new Date(state.pickedYear, state.pickedMonth - 1).getDay()
    return weekNo == 0 ? 7 : weekNo
})

function canPickThisDay(day){
    const pickedDate = new Date(state.pickedYear, state.pickedMonth - 1, day)
    const leftRangeDate = new Date(state.validDateTimeRange[0].getFullYear(), state.validDateTimeRange[0].getMonth(), state.validDateTimeRange[0].getDate())
    const rightRangeDate = new Date(state.validDateTimeRange[1].getFullYear(), state.validDateTimeRange[1].getMonth(), state.validDateTimeRange[1].getDate())
    return pickedDate >= leftRangeDate && pickedDate <= rightRangeDate
}

function chooseFirstValidDay(){
    for(let i = 1; i <= daysCountOfPickedMonth.value; i++){
        if(canPickThisDay(i)){
            state.pickedDate = i
            break
        }
    }
}

function addOneMonth() {
    if (state.pickedMonth == 12) {
        state.pickedYear++
        state.pickedMonth = 1
    } else {
        state.pickedMonth++
    }

    chooseFirstValidDay()
}

function minusOneMonth() {
    if (state.pickedMonth == 1) {
        state.pickedYear--
        state.pickedMonth = 12
    } else {
        state.pickedMonth--
    }

    chooseFirstValidDay()
}

function minusOneYear() {
    if(!canPickYearBefore.value) return
    state.pickedYear--

    chooseFirstValidDay()
}

function addOneYear() {
    if(!canPickYearAfter) return
    state.pickedYear++

    chooseFirstValidDay()
}

function closeAndClear(){
    emits('closeWithClear')
}

function closeAndOk() {
    const pickedTimestamps = new Date(state.pickedYear, state.pickedMonth - 1, state.pickedDate, state.pickedHour, state.pickedMinute).getTime()
    emits('closeWithOk', { timestamps: pickedTimestamps })
}

onMounted(() => {
    const now = props.curPickedTime ? new Date(props.curPickedTime) : new Date()
    state.pickedYear = now.getFullYear()
    state.pickedMonth = now.getMonth() + 1
    state.pickedDate = now.getDate()
    state.pickedHour = now.getHours()
    state.pickedMinute = now.getMinutes()
})
</script>