<template>
    <div class="card-container ring-1 ring-slate-900/5">
            <div id="date-picker">
                <div class="flex w-full flex-row flex-nowrap justify-between items-center">
                    <div class="text-[11pt] text-[#409EFF] cursor-pointer">清除</div>
                    <div class="text-[11pt]">{{ formattedPickedDateTime }}</div>
                    <div class="text-[11pt] text-[#409EFF] cursor-pointer">确定</div>
                </div>

                <div class="flex flex-row w-full h-[2rem] justify-between items-center">
                    <div
                        @click="state.pickedYear--"
                        :class="[isBeforeNow() ? 'm-disabled' : '']"
                        class="material-icons-round last-year">
                        keyboard_double_arrow_left
                    </div>
                    <div
                        @click="minusOneMonth"
                        :class="[isBeforeNow() ? 'm-disabled' : '']"
                        class="material-icons-round last-month">
                        keyboard_arrow_left
                    </div>
                    <div class="text-[11pt] font-bold">{{ state.pickedYear }}</div>
                    <div
                        @click="addOneMonth"
                        class="material-icons-round next-month">
                        keyboard_arrow_right
                    </div>
                    <div
                        @click="state.pickedYear++"
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
                        class="absolute flex justify-center items-center w-full -translate-x-[1rem] h-[calc(100%-2rem-0.75rem-0.5rem-11pt-2rem-1.25rem-16pt-2rem)] text-[96pt] text-[#EBEEF5] -z-[1]">
                        {{ state.pickedMonth }}
                    </div>
                    <div class="grid grid-cols-7 gap-1 pt-2 cursor-pointer">
                        <div v-for="i in 30"
                            :class="[state.pickedDate == i ? 'bg-[#c6e2ff] hover:bg-[#c6e2ff]' : '']"
                            @click="state.pickedDate = i"
                            class="hover:bg-[#EBEEF5] rounded-full w-[2.5rem] h-[2.5rem] flex justify-center items-center">
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
</style>

<script setup>
import { computed, reactive, onMounted } from 'vue'

const state = reactive({
    showTimePicker: true,
    showDatePicker: true,
    canPickBeforeNow: false,
    weekNames: ['一','二','三','四','五','六','日'],
    pickedYear: 1970,
    pickedMonth: 1,
    pickedDate: 1,
    pickedHour: 0,
    pickedMinute: 0
})

const formattedPickedDateTime=computed(() => {
    const formattedYear = state.pickedYear
    const formattedMonth = state.pickedMonth < 10 ? `0${state.pickedMonth}` : state.pickedMonth
    const formattedDate = state.pickedDate < 10 ? `0${state.pickedDate}` : state.pickedDate
    const formattedHour = state.pickedHour < 10 ? `0${state.pickedHour}` : state.pickedHour
    const formattedMinute = state.pickedMinute < 10 ? `0${state.pickedMinute}` : state.pickedMinute
    return `${formattedYear}-${formattedMonth}-${formattedDate} ${formattedHour}:${formattedMinute}`
})

/**
 * 判断给定时间戳是否在当前时间之前
 * 
 * @returns {boolean} 判断结果
 * @description 如果<code>state.canPickBeforeNow == true</code>, 则一律返回<code>false</code>
 */
function isBeforeNow(){
    if(state.canPickBeforeNow) return false
    // console.log(`now=${Date.parse(new Date())} timestamps=${Date.parse(formattedPickedDateTime.value)}`)
    return Date.parse(new Date()) >= Date.parse(formattedPickedDateTime.value)
}

function addOneMonth(){
    if(state.pickedMonth == 12){
        state.pickedYear++
        state.pickedMonth = 1
    }else{
        state.pickedMonth++
    }
}

function minusOneMonth(){
    if(state.pickedMonth == 1){
        state.pickedYear--
        state.pickedMonth = 12
    }else{
        state.pickedMonth--
    }

}

onMounted(() => {
    const now = new Date()
    state.pickedYear = now.getFullYear()
    state.pickedMonth = now.getMonth() + 1
    state.pickedDate = now.getDate()
    state.pickedHour = now.getHours()
    state.pickedMinute = now.getMinutes()
})
</script>