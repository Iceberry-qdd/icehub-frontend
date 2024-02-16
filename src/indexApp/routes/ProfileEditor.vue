<template>
    <div id="profile-editor">
        <Header
            :width="state.headerConfig.width"
            :title="state.headerConfig.title"
            :go-back="state.headerConfig.goBack"
            :show-menu="state.headerConfig.showMenu"
            :menu-icon="state.headerConfig.menuIcon"
            :icon-tooltip="state.headerConfig.iconTooltip"
            @handle-action="handleAction">
        </Header>
        <!-- eslint-disable-next-line vue/max-attributes-per-line -->
        <div v-if="state.isLoading == true" class="loading">
            <IconLoading class="-ml-1 h-5 mr-3 text-white w-5"></IconLoading>
            <div>正在提交...</div>
        </div>
        <div class="h-[20.7rem] relative w-full">
            <div class="banner-cover">
                <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                <span class="material-icons-round" @click="showImageCropper('banner')"> edit </span>
            </div>
            <div class="avatar-cover">
                <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                <span class="material-icons-round" @click="showImageCropper('avatar')"> edit </span>
            </div>
        </div>

        <div class="absolute top-[56px] w-[calc(100%*5/13)]">
            <Banner
                :user="state.user"
                class="h-[20.7rem] object-center object-cover w-full">
            </Banner>
        </div>
        <div class="-translate-y-[2.5rem]">
            <Avatar
                :user="state.user"
                class="h-[5rem] rounded-lg translate-x-[1rem] w-[5rem]">
            </Avatar>
            <div class="text-info">
                <div class="form-floating mb-3">
                    <input
                        id="floatingInput"
                        v-model.trim="state.newUser.nickname"
                        type="text"
                        class="form-control"
                        :class="isUNameValid.class"
                        placeholder="用户名"
                        required
                        @blur="checkUsernameValid" />
                    <label for="floatingInput">用户名</label>
                    <!-- <div class="valid-feedback">Looks good!</div> -->
                    <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                    <div class="invalid-feedback">{{ isUNameValid.msg }}</div>
                </div>
                <div class="form-floating mb-3">
                    <!-- eslint-disable-next-line vue/html-self-closing -->
                    <textarea
                        id="floatingTextarea"
                        v-model.trim="state.newUser.remark"
                        class="form-control"
                        placeholder="个人简介">
                    </textarea>
                    <label for="floatingTextarea">个人简介</label>
                </div>
                <div class="form-floating mb-3">
                    <input
                        id="floatingInput"
                        v-model.trim="state.newUser.city"
                        type="text"
                        class="form-control"
                        placeholder="所在城市" />
                    <label for="floatingInput">所在城市</label>
                </div>
                <div class="form-floating mb-3">
                    <input
                        id="floatingInput"
                        v-model.trim="state.newUser.age"
                        type="number"
                        :class="isAgeValid.class"
                        class="form-control"
                        placeholder="年龄" />
                    <label for="floatingInput">年龄</label>
                    <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                    <div class="invalid-feedback">{{ isAgeValid.msg }}</div>
                </div>
                <div class="form-floating mb-3">
                    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                    <select v-model="selected" class="form-select">
                        <!-- eslint-disable-next-line vue/max-attributes-per-line, vue/singleline-html-element-content-newline -->
                        <option disabled value="">请选择性别</option>
                        <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                        <option value="MALE">男</option>
                        <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                        <option value="FEMALE">女</option>
                        <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                        <option value="UNKNOWN">不设置</option>
                    </select>
                    <label for="floatingInput">性别</label>
                </div>
                <div class="form-floating mb-3">
                    <input
                        id="floatingInput"
                        v-model.trim="state.newUser.email"
                        type="email"
                        :class="isEmailValid.class"
                        class="form-control"
                        placeholder="电子邮件" />
                    <label for="floatingInput">电子邮件</label>
                    <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                    <div class="invalid-feedback">{{ isEmailValid.msg }}</div>
                </div>
                <div class="form-floating mb-3">
                    <input
                        id="floatingInput"
                        v-model.trim="state.newUser.phoneNumber"
                        type="tel"
                        :class="isPhoneNoValid.class"
                        class="form-control"
                        placeholder="手机号码" />
                    <label for="floatingInput">手机号码</label>
                    <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                    <div class="invalid-feedback">{{ isPhoneNoValid.msg }}</div>
                </div>
                <div class="form-floating mb-3">
                    <input
                        id="floatingInput"
                        v-model.trim="state.newUser.website"
                        type="url"
                        class="form-control"
                        :class="isWebsiteValid.class"
                        placeholder="个人网站" />
                    <label for="floatingInput">个人网站</label>
                    <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
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
    position: absolute;
    top: calc(21rem - 2.8rem);
    margin-left: 1rem;
    border-radius: 8px;
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

.banner-cover {
    background-color: #00000000;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    width: 100%;
    height: 20.7rem;
    z-index: 1;
}

.banner-cover:hover {
    background-color: #00000066;
}

.text-info {
    padding: 1rem 1rem 0 1rem;
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
import Header from '@/indexApp/components/Header.vue'
import { reactive, computed, watch, ref, onUnmounted } from 'vue'
import { store } from '@/indexApp/js/store.js'
import { uploadUserAvatar, uploadUserBanner, isUserExists, updateUserProfile } from '@/indexApp/js/api.js'
import { useRouter } from 'vue-router'
import IconLoading from '@/components/icons/IconLoading.vue'
import Avatar from '@/indexApp/components/Avatar.vue'
import Banner from '@/indexApp/components/Banner.vue'

const router = useRouter()
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
    newAvatar: null,
    newBanner: null,
    isLoading: false,
    isUsernameExisted: false,
    headerConfig: {
        title: '编辑资料',
        goBack: true,
        showMenu: true,
        menuIcon: 'done',
        iconTooltip: '提交资料',
        width: 0
    }
})

const selected = ref(state.user.gender)

function showImageCropper(mode) {
    store.setCroppedImageMode(mode)
    store.showImageCropper()
    document.querySelector("body").setAttribute("style", "overflow:hidden")
}

function handleAction() {
    state.newUser.gender = selected.value
    submitProfile()
}

async function checkUsernameValid() {
    try {
        const username = state.newUser.nickname
        const response = await isUserExists(username)
        if (!response.ok) throw new Error((await response.json()).error)

        const result = await response.text()
        state.isUsernameExisted = result == 'true' ? true : false
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    }
}

async function submitProfile() {
    state.isLoading = true
    try {
        //FIXME 提交前检查是否修改过
        // if(state.newUser == state.user){
        //     store.setWarningMsg("您没有更改资料中的任何一项，因此您的个人资料将保持现状！")
        //     return
        // }

        checkUsernameValid()
        if (state.isUsernameExisted) throw new Error('该用户名已被使用！')

        state.newAvatar = store.CROPPED_IMAGE.avatar
        state.newBanner = store.CROPPED_IMAGE.banner
        if (state.newAvatar) {
            await uploadAvatar()
        }
        if (state.newBanner) {
            await uploadBanner()
        }

        const response = await updateUserProfile(state.newUser)
        if (!response.ok) throw new Error((await response.json()).error)

        const data = await response.json()
        localStorage.setItem('CUR_USER', JSON.stringify(data))
        store.setSuccessMsg('变更成功！')
        router.push({ name: 'profile', params: { nickname: data.nickname } })
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    } finally {
        state.isLoading = false
    }
}

async function uploadAvatar() {
    try {
        const data = {
            type: state.newAvatar.split(',')[0].replace('data:', '').replace(';base64', ''),
            data: state.newAvatar.split(',')[1],
        }
        const response = await uploadUserAvatar(data)
        if (!response.ok) throw new Error((await response.json()).error)

        state.newUser.avatarUrl = await response.json()
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    }
}

async function uploadBanner() {
    try {
        const data = {
            type: state.newBanner.split(',')[0].replace('data:', '').replace(';base64', ''),
            data: state.newBanner.split(',')[1],
        }
        const response = await uploadUserBanner(data)
        if (!response.ok) throw new Error((await response.json()).error)

        state.newUser.bannerUrl = await response.json()
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    }
}

watch(() => store.CROPPED_IMAGE.banner, (newVal, oldVal) => {
    state.user.bannerUrl = {
        previewUrl: newVal,
        originUrl: newVal
    }
})

watch(() => store.CROPPED_IMAGE.avatar, (newVal, oldVal) => {
    state.user.avatarUrl = {
        previewUrl: newVal,
        originUrl: newVal
    }
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

    if (state.newUser.email.toString().match(/^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/)) {
        return { 'class': 'is-valid', 'msg': '' }
    }

    return { 'class': 'is-invalid', 'msg': '您输入的不是一个有效的邮箱地址！' }
})

const isPhoneNoValid = computed(() => {
    if (!state.newUser.phoneNumber || state.newUser.phoneNumber == state.user.phoneNumber) {
        return { 'class': '', 'msg': '' }
    }

    if (state.newUser.phoneNumber.toString().match(/^(\+[0-9]{1,3})?[0-9]{3,5}-?[0-9]{3,5}-?[0-9]{3,5}-?$/)) {
        return { 'class': 'is-valid', 'msg': '' }
    }

    return { 'class': 'is-invalid', 'msg': '您输入的不是一个有效的手机号码！' }
})

const isWebsiteValid = computed(() => {
    if (!state.newUser.website || state.newUser.website == state.user.website) {
        return { 'class': '', 'msg': '' }
    }

    if (state.newUser.website.toString().match(/^https?:\/\/(www\.)?[a-zA-Z0-9]+\.[a-zA-Z]+\/?(\/?[a-zA-Z0-9.]+)?$/)) {
        return { 'class': 'is-valid', 'msg': '' }
    }

    return { 'class': 'is-invalid', 'msg': '暂不支持您输入的网站！' }
})

onUnmounted(() => {
    store.clearCroppedImage()
})
</script>