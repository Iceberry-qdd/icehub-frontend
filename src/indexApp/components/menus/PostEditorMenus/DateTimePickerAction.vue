<template>
    <div class="card-container ring-1 ring-slate-900/5 shadow-lg">
        <div
            v-if="props.noteMsg"
            class="bg-[#f1f3f4] cursor-default flex gap-2 h-[2.5rem] items-center justify-left p-3 rounded-lg w-full">
            <IconInfo class="bg-[#cfe2ff] box-content p-[0.1rem] rounded-full"></IconInfo>
            {{ props.noteMsg }}
        </div>
        <div id="date-picker">
            <div class="flex flex-nowrap flex-row items-center justify-between w-full">
                <div
                    class="btn-no-select cursor-pointer text-[#409EFF] text-[11pt]"
                    @click="closeAndClear">
                    清除
                </div>
                <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                <div class="text-[11pt]">{{ formattedPickedDateTime }}</div>
                <div
                    class="btn-no-select cursor-pointer text-[#409EFF] text-[11pt]"
                    @click="closeAndOk">
                    确定
                </div>
            </div>

            <div class="flex flex-row h-[2rem] items-center justify-between w-full">
                <div
                    :class="[canPickYearBefore ? '' : 'm-disabled']"
                    class="last-year material-icons-round"
                    @click="minusOneYear">
                    keyboard_double_arrow_left
                </div>
                <div
                    :class="[canPickMonthBefore ? '' : 'm-disabled']"
                    class="last-month material-icons-round"
                    @click="canPickMonthBefore ? minusOneMonth() : ''">
                    keyboard_arrow_left
                </div>
                <div class="font-bold text-[11pt]">
                    {{ `${state.pickedYear}-${state.pickedMonth}` }}
                </div>
                <div
                    :class="[canPickMonthAfter ? '' : 'm-disabled']"
                    class="material-icons-round next-month"
                    @click="canPickMonthAfter ? addOneMonth() : ''">
                    keyboard_arrow_right
                </div>
                <div
                    :class="[canPickYearAfter ? '' : 'm-disabled']"
                    class="material-icons-round next-year"
                    @click="addOneYear">
                    keyboard_double_arrow_right
                </div>
            </div>
            <div class="cursor-default  divide-y">
                <div class="gap-1 grid grid-cols-7">
                    <div
                        v-for="(week, index) in state.weekNames"
                        :key="index"
                        class="btn-no-select flex h-[2.5rem] items-center justify-center w-[2.5rem]">
                        {{ week }}
                    </div>
                </div>
                <div class="cursor-pointer gap-1 grid grid-cols-7 pt-2">
                    <div
                        v-for="i in startWeekOfPickedMonth - 1"
                        :key="i"
                        class="cursor-default flex h-[2.5rem] items-center justify-center rounded-full w-[2.5rem]" />

                    <div
                        v-for="i in daysCountOfPickedMonth"
                        :key="i"
                        :class="[state.pickedDay == i ? 'text-white bg-blue-500' : 'hover:bg-[#EBEEF5]', canPickThisDay(i) ? '' : 'm-disabled']"
                        class="btn-no-select flex h-[2.5rem] items-center justify-center rounded-full w-[2.5rem]"
                        @click="canPickThisDay(i) ? state.pickedDay = i : ''">
                        {{ i }}
                    </div>
                </div>
            </div>
        </div>

        <div id="time-picker">
            <select
                id="hour-picker"
                v-model="state.pickedHour"
                class="border-[1px] focus-visible:outline-none focus:ring-2 px-4 py-[0.25rem] ring-blue-500 ring-offset-2 rounded-[6px]"
                required
                name="hour-picker">
                <option
                    v-for="(hour, index) in 24"
                    :key="index"
                    class="font-normal text-[11pt]"
                    :value="index">
                    {{ index < 10 ? '0' + index : index }}
                </option>
            </select>

            <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
            <div class="px-4">:</div>

            <select
                id="minute-picker"
                v-model="state.pickedMinute"
                class="border-[1px] focus-visible:outline-none focus:ring-2 px-4 py-[0.25rem] ring-blue-500 ring-offset-2 rounded-[6px]"
                required
                name="minute-picker">
                <option
                    v-for="(minute, index) in 60"
                    :key="index"
                    class="font-normal text-[11pt]"
                    :value="index">
                    {{ index < 10 ? '0' + index : index }}
                </option>
            </select>
        </div>
    </div>
</template>

<style scoped>
.material-icons-round {
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
    color: #606266;
    font-size: 10pt;
    top: 2.5rem;
    min-width: max-content;
    min-height: max-content;
    background-color: white;
    border: 1px solid #EEEEEE;
    border-radius: 6px;
    padding: 1rem;
}

#time-picker {
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

.m-disabled {
    color: #C0C4CC;
    cursor: not-allowed;
}

.m-disabled:hover {
    background-color: transparent;
}
</style>

<script setup>
import { computed, reactive, onMounted, onUnmounted } from 'vue'
import IconInfo from '@/components/icons/IconInfo.vue'
import { standardDateTime } from '@/indexApp/utils/formatUtils.js'

const props = defineProps({
    /** 是否显示时间选择仪表盘 */
    showTimePicker: {
        type: Boolean,
        required: true
    },
    /** 是否选择日期选择仪表盘 */
    showDatePicker: {
        type: Boolean,
        required: true 
    },
    /** 有效的时间戳范围数组，[since, until] */
    validDateTimeRange: {
        type: Array,
        required: true
    },
    /** 当前选择的时间戳 */
    curPickedTime: {
        type: Number,
        required: true
    },
    /** 提示消息 */
    // eslint-disable-next-line vue/no-unused-properties
    noteMsg: {
        type: String,
        required: false,
        default: ''
    }
})
const emits = defineEmits(['closeWithOk', 'closeWithClear'])

// eslint-disable-next-line vue/no-setup-props-reactivity-loss
const state = reactive({
    showTimePicker: props.showTimePicker,
    showDatePicker: props.showDatePicker,
    weekNames: ['一', '二', '三', '四', '五', '六', '日'],
    pickedYear: 1970,
    pickedMonth: 1,
    pickedDay: 1,
    pickedHour: 8,
    pickedMinute: 0,
    validDateTimeRange: props.validDateTimeRange
})

const formattedPickedDateTime = computed(() => {
    const dateTime = new Date(state.pickedYear, state.pickedMonth - 1, state.pickedDay, state.pickedHour, state.pickedMinute, 0, 0)
    return standardDateTime(dateTime.valueOf())
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

const startWeekOfPickedMonth = computed(() => {
    const weekNo = new Date(state.pickedYear, state.pickedMonth - 1).getDay()
    return weekNo == 0 ? 7 : weekNo
})

function canPickThisDay(day) {
    const pickedDate = new Date(state.pickedYear, state.pickedMonth - 1, day)
    const leftRangeDate = new Date(state.validDateTimeRange[0].getFullYear(), state.validDateTimeRange[0].getMonth(), state.validDateTimeRange[0].getDate())
    const rightRangeDate = new Date(state.validDateTimeRange[1].getFullYear(), state.validDateTimeRange[1].getMonth(), state.validDateTimeRange[1].getDate())
    return pickedDate >= leftRangeDate && pickedDate <= rightRangeDate
}

function chooseFirstValidDay() {
    for (let i = 1; i <= daysCountOfPickedMonth.value; i++) {
        if (canPickThisDay(i)) {
            state.pickedDay = i
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
    if (!canPickYearBefore.value) return
    state.pickedYear--

    chooseFirstValidDay()
}

function addOneYear() {
    if (!canPickYearAfter.value) return
    state.pickedYear++

    chooseFirstValidDay()
}

function closeAndClear() {
    emits('closeWithClear')
}

function closeAndOk() {
    const pickedTimestamps = new Date(state.pickedYear, state.pickedMonth - 1, state.pickedDay, state.pickedHour, state.pickedMinute).getTime()
    emits('closeWithOk', { timestamps: pickedTimestamps })
}

onMounted(() => {
    const now = props.curPickedTime !== 0 ? new Date(props.curPickedTime) : new Date()
    state.pickedYear = now.getFullYear()
    state.pickedMonth = now.getMonth() + 1
    state.pickedDay = now.getDate()
    state.pickedHour = now.getHours()
    state.pickedMinute = now.getMinutes()

    const dateTimePickerAction = document.querySelector('#dateTimePickerAction')
    document.querySelector('#app').addEventListener('click', function (event) {
        if (!dateTimePickerAction.contains(event.target)) {
            emits('closeWithClear')
        }
    })
})

onUnmounted(() => {
    document.querySelector('#app').removeEventListener('click', () => { })
})
</script>