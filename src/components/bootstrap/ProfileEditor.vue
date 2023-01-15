<template>
    <div>
        <Header :title="state.headerConfig.title" :goBack="state.headerConfig.goBack"
            :showMenu="state.headerConfig.showMenu" :menuIcon="state.headerConfig.menuIcon"
            :menuAction="state.headerConfig.menuAction"></Header>
        <div v-if="state.isLoading == true" class="loading">
            <IconLoading :class="'-ml-1 mr-3 h-5 w-5 text-white'"></IconLoading>
            <div>正在提交...</div>
        </div>
        <div>
            <div class="banner-cover">
                <span @click="showImageCropper('banner')" class="material-icons-round">edit</span>
            </div>
            <div class="avatar-cover">
                <span @click="showImageCropper('avatar')" class="material-icons-round">edit</span>
            </div>
        </div>
        <div class="content">
            <div class="banner">
                <img class=" w-[38rem] h-[18rem] object-cover object-center" :src="bannerPic" />
            </div>
            <div><img class="avatar relative top-[-2.5rem] left-[1rem] w-[5rem] h-[5rem] rounded-lg" :src="avatarPic" />
            </div>
            <div class="text-info">
                <div class="form-floating mb-3">
                    <input @blur="checkUsernameValid" v-model.trim="state.newUser.nickname" type="text"
                        class="form-control" :class="isUNameValid.class" id="floatingInput" placeholder="用户名" required>
                    <label for="floatingInput">用户名</label>
                    <!-- <div class="valid-feedback">Looks good!</div> -->
                    <div class="invalid-feedback">{{ isUNameValid.msg }}</div>
                </div>
                <div class="form-floating mb-3">
                    <textarea v-model.trim="state.newUser.remark" class="form-control" placeholder="个人简介"
                        id="floatingTextarea"></textarea>
                    <label for="floatingTextarea">个人简介</label>
                </div>
                <div class="form-floating mb-3">
                    <input v-model.trim="state.newUser.city" type="text" class="form-control" id="floatingInput"
                        placeholder="所在城市">
                    <label for="floatingInput">所在城市</label>
                </div>
                <div class="form-floating mb-3">
                    <input v-model.trim="state.newUser.age" type="number" :class="isAgeValid.class" class="form-control"
                        id="floatingInput" placeholder="年龄">
                    <label for="floatingInput">年龄</label>
                    <div class="invalid-feedback">{{ isAgeValid.msg }}</div>
                </div>
                <div class="form-floating mb-3">
                    <select v-model="selected" class="form-select">
                        <option disabled value="">请选择性别</option>
                        <option value="MALE">男</option>
                        <option value="FEMALE">女</option>
                        <option value="UNKNOWN">不设置</option>
                    </select>
                    <label for="floatingInput">性别</label>
                </div>
                <div class="form-floating mb-3">
                    <input v-model.trim="state.newUser.email" type="email" :class="isEmailValid.class"
                        class="form-control" id="floatingInput" placeholder="电子邮件">
                    <label for="floatingInput">电子邮件</label>
                    <div class="invalid-feedback">{{ isEmailValid.msg }}</div>
                </div>
                <div class="form-floating mb-3">
                    <input v-model.trim="state.newUser.phoneNumber" type="tel" :class="isPhoneNoValid.class"
                        class="form-control" id="floatingInput" placeholder="手机号码">
                    <label for="floatingInput">手机号码</label>
                    <div class="invalid-feedback">{{ isPhoneNoValid.msg }}</div>
                </div>
                <div class="form-floating mb-3">
                    <input v-model.trim="state.newUser.website" type="url" class="form-control"
                        :class="isWebsiteValid.class" id="floatingInput" placeholder="个人网站">
                    <label for="floatingInput">个人网站</label>
                    <div class="invalid-feedback">{{ isWebsiteValid.msg }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import url("bootstrap/dist/css/bootstrap.css");

.material-icons-round:hover {
    background-color: #000000aa;
}

.avatar-cover {
    background-color: #00000000;
    position: relative;
    top: -2.5rem;
    margin-left: 1rem;
    padding: 1rem;
    width: 5rem;
    height: 5rem;
    z-index: 98;
    display: flex;
    justify-content: center;
    align-items: center;
}

.avatar-cover:hover {
    background-color: #00000066;
    position: relative;
    top: -2.3rem;
    margin-left: 1.3rem;
    border-radius: 4px;
    padding: 1rem;
    width: 5rem;
    height: 5rem;
    z-index: 98;
    display: flex;
    justify-content: center;
    align-items: center;
}

.avatar-cover>.material-icons-round {
    color: transparent;
    font-size: 24pt;
}

.avatar-cover:hover>.material-icons-round {
    color: white;
    font-size: 18pt;
}

.banner-cover>.material-icons-round {
    color: transparent;
    font-size: 18pt;
}

.banner-cover:hover>.material-icons-round {
    color: white;
    font-size: 24pt;
}

.avatar {
    border: 4px solid white;
    z-index: 97;
    box-sizing: content-box;
}

.banner-cover {
    background-color: #00000000;
    position: relative;
    width: 100%;
    height: 18rem;
    z-index: 96;
    display: flex;
    justify-content: center;
    align-items: center;
}

.banner-cover:hover {
    background-color: #00000066;
    position: relative;
    width: 100%;
    height: 18rem;
    z-index: 96;
}

.content {
    position: relative;
    top: -23rem;
}

.text-info {
    padding-left: 1rem;
    padding-right: 1rem;
}

.loading {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.5rem;
    align-items: center;
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: #00000066;
    z-index: 107;
    color: white;
}
</style>

<script setup>
import Header from '@/components/tailwind/Header.vue'
import { reactive, computed, watch, ref } from 'vue';
import { store } from '@/store.js';
import { uploadUserAvatar, uploadUserBanner, isUserExists, updateUserProfile } from '@/api.js'
import router from '@/route';
import IconLoading from '@/components/icons/IconLoading.vue';

const state = reactive({
    user: JSON.parse(localStorage.getItem("CUR_USER")),
    newUser: {
        id: JSON.parse(localStorage.getItem("CUR_USER")).id,
        nickname: JSON.parse(localStorage.getItem("CUR_USER")).nickname,
        avatarUrl: null,
        bannerUrl: null,
        age: JSON.parse(localStorage.getItem("CUR_USER")).age,
        gender: JSON.parse(localStorage.getItem("CUR_USER")).gender,
        address: JSON.parse(localStorage.getItem("CUR_USER")).address,
        email: JSON.parse(localStorage.getItem("CUR_USER")).email,
        city: JSON.parse(localStorage.getItem("CUR_USER")).city,
        phoneNumber: JSON.parse(localStorage.getItem("CUR_USER")).phoneNumber,
        website: JSON.parse(localStorage.getItem("CUR_USER")).website,
        remark: JSON.parse(localStorage.getItem("CUR_USER")).remark
    },
    newAvatar: store.CROPPED_IMAGE.avatar,
    newBanner: store.CROPPED_IMAGE.banner,
    isLoading: false,
    isUsernameExisted: false,
    headerConfig: {
        title: '编辑资料',
        goBack: true,
        showMenu: true,
        menuIcon: 'done',
        menuAction: { action: 'submit', param: true }
    }
})

const selected = ref(state.user.gender)

function showImageCropper(mode) {
    store.setCroppedImageMode(mode)
    store.showImageCropper()
    document.querySelector("body").setAttribute("style", "overflow:hidden")
}

watch(() => store.IS_SUBMIT, (newVal, oldVal) => {
    if (newVal == true) {
        state.newUser.gender = selected.value
        //console.table(state.newUser)
        submitProfile()
    }
})

async function checkUsernameValid() {
    try {
        const username = state.newUser.nickname
        const response = await isUserExists(username)
        if (!response.ok) throw new Error(await response.text())

        const result = await response.text()
        state.isUsernameExisted = result == 'true' ? true : false
    } catch (e) {
        store.setMsg(e.message)
        console.error(e)
    }
}

async function submitProfile() {
    state.isLoading = true
    try {
        checkUsernameValid()
        if (state.isUsernameExisted) throw new Error('该用户名已被使用！')

        state.newAvatar = store.CROPPED_IMAGE.avatar
        state.newBanner = store.CROPPED_IMAGE.banner
        if (state.newAvatar) {
            await uploadAvatar()
        } else {
            state.newUser.avatarUrl = null
        }
        if (state.newBanner) {
            await uploadBanner()
        } else {
            state.newUser.bannerUrl = null
        }

        const response = await updateUserProfile(state.newUser)
        if (!response.ok) throw new Error(await response.text())

        const data = await response.json()
        localStorage.setItem('CUR_USER', JSON.stringify(data))
        router.push({ name: 'profile', params: { nickname: data.nickname } })
    } catch (e) {
        store.setMsg(e.message)
        console.error(e)
    } finally {
        state.isLoading = false
    }
}

async function uploadAvatar() {
    try {
        const data = state.newAvatar.split(',')[1]
        const response = await uploadUserAvatar(data)
        if (!response.ok) throw new Error(await response.text())

        state.newUser.avatarUrl = await response.json()
    } catch (e) {
        store.setMsg(e.message)
        console.error(e)
    }
}

async function uploadBanner() {
    try {
        const data = state.newBanner.split(',')[1]
        const response = await uploadUserBanner(data)
        if (!response.ok) throw new Error(await response.text())

        state.newUser.bannerUrl = await response.json()
    } catch (e) {
        store.setMsg(e.message)
        console.error(e)
    }
}

const bannerPic = computed(() => {
    const bannerUrl = state.user.bannerUrl
    const clippedUrl = store.CROPPED_IMAGE.banner
    return clippedUrl || bannerUrl || '/src/assets/default-bg.jpg'
})

const avatarPic = computed(() => {
    const avatarUrl = state.user.avatarUrl
    const clippedUrl = store.CROPPED_IMAGE.avatar
    return clippedUrl || avatarUrl || `https://api.multiavatar.com/${state.user.nickname}.svg`
})


const isUNameValid = computed(() => {
    if (state.newUser.nickname == state.user.nickname) {
        return { 'class': '', 'msg': '' }
    }
    if (!state.isUsernameExisted) {
        return { 'class': 'is-valid', 'msg': '' }
    } else {
        return { 'class': 'is-invalid', 'msg': '此用户名已被使用！' }
    }
})
const isAgeValid = computed(() => {
    if (!state.newUser.age || state.newUser.age == state.user.age) {
        return { 'class': '', 'msg': '' }
    }

    if (!state.newUser.age.toString().match('^[0-9]+$')) {
        return { 'class': 'is-invalid', 'msg': '您输入的不是一个有效的年龄' }
    }

    if (state.newUser.age < 0) {
        return { 'class': 'is-invalid', 'msg': '年龄不能小于0！' }
    }

    if (state.newUser.age > 128) {
        return { 'class': 'is-invalid', 'msg': '此年龄值超出我们所能处理的范围！' }
    }

    return { 'class': 'is-valid', 'msg': '' }
})

const isEmailValid = computed(() => {
    if (!state.newUser.email || state.newUser.email == state.user.email) {
        return { 'class': '', 'msg': '' }
    }

    if (!state.newUser.email) state.newUser.email = ''

    if (state.newUser.email.toString().match(/^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/)) {
        return { 'class': 'is-valid', 'msg': '' }
    }

    return { 'class': 'is-invalid', 'msg': '您输入的不是一个有效的邮箱地址！' }
})

const isPhoneNoValid = computed(() => {
    if (!state.newUser.phoneNumber || state.newUser.phoneNumber == state.user.phoneNumber) {
        return { 'class': '', 'msg': '' }
    }

    if (!state.newUser.phoneNumber) state.newUser.phoneNumber = ''

    if (state.newUser.phoneNumber.toString().match(/^(\+[0-9]{1,3})?[0-9]{3,5}-?[0-9]{3,5}-?[0-9]{3,5}-?$/)) {
        return { 'class': 'is-valid', 'msg': '' }
    }

    return { 'class': 'is-invalid', 'msg': '您输入的不是一个有效的手机号码！' }
})

const isWebsiteValid = computed(() => {
    if (!state.newUser.website || state.newUser.website == state.user.website) {
        return { 'class': '', 'msg': '' }
    }

    if (!state.newUser.website) state.newUser.website = ''

    if (state.newUser.website.toString().match(/^https?:\/\/(www\.)?[a-zA-Z0-9]+\.[a-zA-Z]+\/?(\/?[a-zA-Z0-9.]+)?$/)) {
        return { 'class': 'is-valid', 'msg': '' }
    }

    return { 'class': 'is-invalid', 'msg': '暂不支持您输入的网站！' }
})
</script>