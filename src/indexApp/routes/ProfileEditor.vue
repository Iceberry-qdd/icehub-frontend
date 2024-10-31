<template>
    <div id="profile-editor">
        <Header
            class="sticky"
            :width="state.headerConfig.width"
            :title="state.headerConfig.title"
            :go-back="state.headerConfig.goBack"
            :show-menu="state.headerConfig.showMenu"
            :menu-icon="state.headerConfig.menuIcon"
            :icon-tooltip="state.headerConfig.iconTooltip"
            @handle-action="handleSubmit">
        </Header>
        <!-- eslint-disable-next-line vue/max-attributes-per-line -->
        <div v-if="state.isLoading" class="loading">
            <IconLoading class="-ml-1 h-5 mr-3 text-white w-5"></IconLoading>
            <div>正在提交...</div>
        </div>

        <div class="banner-cover">
            <span
                class="material-symbols-rounded"
                @click="showImageChangeProper('banner')">
                edit
            </span>
        </div>
        
        <Banner
            :user="state.newUser"
            class="-mb-[calc(5rem/2)] aspect-video object-center object-cover w-full z-[1]">
        </Banner>

        <div class="avatar-cover">
            <span
                class="material-symbols-rounded"
                @click="showImageChangeProper('avatar')">
                edit
            </span>
        </div>

        <Avatar
            :user="state.newUser"
            class="h-[5rem] rounded-lg text-[5rem] translate-x-[1rem] w-[5rem]">
        </Avatar>
        <div class="text-info">
            <div class="form-floating mb-3">
                <input
                    id="nicknameInput"
                    v-model="state.newUser.nickname"
                    type="text"
                    class="form-control"
                    :class="isUNameValid.class"
                    placeholder="用户名"
                    required
                    @blur="checkUsernameValid" />
                <label for="nicknameInput">用户名</label>
                <!-- <div class="valid-feedback">Looks good!</div> -->
                <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                <div class="invalid-feedback">{{ isUNameValid.msg }}</div>
            </div>
            <div class="form-floating mb-3">
                <!-- eslint-disable-next-line vue/html-self-closing -->
                <textarea
                    id="floatingTextarea"
                    v-model="state.newUser.remark"
                    class="form-control"
                    placeholder="个人简介">
                    </textarea>
                <label for="floatingTextarea">个人简介</label>
            </div>
            <div class="form-floating mb-3">
                <input
                    id="ageInput"
                    v-model="state.newUser.age"
                    type="number"
                    :class="isAgeValid.class"
                    class="form-control"
                    placeholder="年龄" />
                <label for="ageInput">年龄</label>
                <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                <div class="invalid-feedback">{{ isAgeValid.msg }}</div>
            </div>
            <div class="form-floating mb-3">
                <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                <select id="genderInput" v-model="selected" class="form-select">
                    <!-- eslint-disable-next-line vue/max-attributes-per-line, vue/singleline-html-element-content-newline -->
                    <option disabled value="">请选择性别</option>
                    <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                    <option value="MALE">男</option>
                    <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                    <option value="FEMALE">女</option>
                    <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                    <option value="UNKNOWN">不设置</option>
                </select>
                <label for="genderInput">性别</label>
            </div>
            <div class="form-floating mb-3">
                <input
                    id="emailInput"
                    v-model="state.newUser.email"
                    type="email"
                    :class="isEmailValid.class"
                    class="form-control"
                    placeholder="电子邮件" />
                <label for="emailInput">电子邮件</label>
                <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                <div class="invalid-feedback">{{ isEmailValid.msg }}</div>
            </div>
            <div class="form-floating mb-3">
                <input
                    id="phoneInput"
                    v-model="state.newUser.phoneNumber"
                    type="tel"
                    :class="isPhoneNoValid.class"
                    class="form-control"
                    placeholder="手机号码" />
                <label for="phoneInput">手机号码</label>
                <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                <div class="invalid-feedback">{{ isPhoneNoValid.msg }}</div>
            </div>
            <div class="form-floating mb-3">
                <input
                    id="websiteInput"
                    v-model="state.newUser.website"
                    type="url"
                    class="form-control"
                    :class="isWebsiteValid.class"
                    placeholder="个人网站" />
                <label for="websiteInput">个人网站</label>
                <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                <div class="invalid-feedback">{{ isWebsiteValid.msg }}</div>
            </div>
        </div>
        <Teleport to="#app">
            <div
                v-if="state.imageChangeProper.show && store.MOBILE_MODE"
                class="bg-black/50 fixed fixed-page h-screen left-0 sm:hidden top-0 w-screen z-[1000]"
                @click="state.imageChangeProper.show = false" />
            <Transition name="fade">
                <ImageChangeProper
                    v-if="state.imageChangeProper.show"
                    class="fixed h-full max-sm:bottom-0 max-sm:h-fit max-sm:z-[1001] sm:top-0 w-full z-[99]"
                    :from="state.imageChangeProper.from"
                    @dismiss="state.imageChangeProper.show = false"
                    @select="handleImageChangeProperSelect">
                </ImageChangeProper>
            </Transition>
            <Transition name="fade">
                <EmojiAvatarEditor
                    v-if="state.imageChangeProper.select === 'emoji'"
                    class="fixed h-full max-sm:z-[1001] top-0 w-full z-[101]"
                    :avatar="state.newUser.avatar"
                    @dismiss="state.imageChangeProper.select = undefined"
                    @avatar="setAvatar">
                </EmojiAvatarEditor>
            </Transition>
            <ImageCropper
                v-if="state.imageChangeProper.select === 'file'"
                class="fixed h-full max-sm:z-[999] top-0 w-full z-[101]"
                :mode="state.cropper.mode"
                :aspect-ratio="state.cropper.aspectRatio"
                @image-file="handleImageFile"
                @dismiss="state.imageChangeProper.select = undefined">
            </ImageCropper>
        </Teleport>
    </div>
</template>

<!-- eslint-disable vue/max-lines-per-block -->
<style scoped>
@import url("bootstrap/dist/css/bootstrap.min.css");

/* XXX 解决bootstrap变量不生效的问题 */
.text-info * {
  --bs-body-color: #212529;
  --bs-body-color-rgb: 33, 37, 41;
  --bs-body-bg: #fff;
  --bs-border-color: #dee2e6;
  --bs-form-valid-border-color: #198754;
  --bs-form-valid-color: #198754;
  --bs-form-invalid-color: #dc3545;
  --bs-form-invalid-border-color: #dc3545;
  --bs-border-width: 1px;
  --bs-border-radius: 0.375rem;
}

.text-info *:where([theme="dark"], [theme="dark"] *){
    --bs-body-color: white;
    --bs-body-color-rgb: 255, 255, 255;
    --bs-body-bg: #121212;
    --bs-border-color: #262626;
}

.text-info input+label:where([theme="dark"], [theme="dark"] *){
    color: rgba(255, 255, 255, 0.5);
}

.material-symbols-rounded:hover {
    background-color: #000000aa;
}

.avatar-cover {
    background-color: #00000000;
    position: absolute;
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

.avatar-cover>.material-symbols-rounded {
    color: transparent;
    font-size: 18pt;
}

.avatar-cover:hover>.material-symbols-rounded {
    color: white;
    background-color: #000000AA;
}

.banner-cover:hover {
    background-color: #00000066;
}

.banner-cover>.material-symbols-rounded {
    color: transparent;
}

.banner-cover:hover>.material-symbols-rounded {
    color: white;
    font-size: 24pt;
    background-color: #000000AA;
}

.banner-cover {
    background-color: #00000000;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    width: 100%;
    aspect-ratio: 16 / 9;
    z-index: 0;
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

.loading:where([theme="dark"], [theme="dark"] *){
    background-color: #000000AA;
}

:is(.form-control, .form-select):focus{
    border-color: rgb(var(--color-primary));
    box-shadow: 0 0 0 .25rem rgba(var(--color-primary) / 0.3);
}
</style>

<!-- eslint-disable vue/max-lines-per-block -->
<script setup>
import Header from '@/indexApp/components/Header.vue'
import { reactive, computed, ref, onUnmounted, defineAsyncComponent } from 'vue'
import { store } from '@/indexApp/js/store.js'
import { uploadUserAvatar, uploadUserBanner, isUserExists, updateUserProfile } from '@/indexApp/js/api.js'
import { useRouter } from 'vue-router'
import IconLoading from '@/components/icons/IconLoading.vue'
import Avatar from '@/components/Avatar.vue'
import Banner from '@/indexApp/components/Banner.vue'
import 'bootstrap'
const ImageChangeProper = defineAsyncComponent(() => import('@/indexApp/components/profile/ImageChangeProper.vue'))
const EmojiAvatarEditor = defineAsyncComponent(() => import('@/indexApp/components/profile/EmojiAvatarEditor.vue'))
const ImageCropper = defineAsyncComponent(() => import('@/indexApp/components/profile/ImageCropper.vue'))

const router = useRouter()
const state = reactive({
    /** 校验对比信息用，旧数据 */
    user: JSON.parse(localStorage.getItem("CUR_USER")),
    /** 校验对比信息用 新数据*/
    newUser: JSON.parse(localStorage.getItem("CUR_USER")),
    isLoading: false,
    isUsernameExisted: false,
    headerConfig: {
        title: '编辑资料',
        goBack: true,
        showMenu: true,
        menuIcon: 'done',
        iconTooltip: '提交资料',
        width: 0
    },
    imageChangeProper: {
        show: false,
        from: 'avatar',
        select: undefined
    },
    cropper: {
        mode: 'aspectRatio',
        aspectRatio: 1
    }
})

const selected = ref(state.user.gender)

function handleSubmit() {
    state.newUser.gender = selected.value
    submitProfile()
}

async function checkUsernameValid() {
    try {
        const username = state.newUser.nickname
        const response = await isUserExists(username)
        if(response.status !== 404) throw new Error('该用户名已存在！')

        const result = await response.text()
        state.isUsernameExisted = result == 'true' ? true : false
    } catch (e) {
        store.setErrorMsg(e.message)
    }
}

async function submitProfile() {
    state.isLoading = true
    try {
        //FIXME 提交前检查是否修改过
        if(state.user.nickname !== state.newUser.nickname){
            checkUsernameValid()
            if (state.isUsernameExisted) throw new Error('该用户名已被使用！')
        }

        if (state.newUser.avatar instanceof File) {
            await uploadAvatar()
        }
        if (state.newUser.banner instanceof File) {
            await uploadBanner()
        }

        const response = await updateUserProfile(state.newUser)
        if (!response.ok) throw new Error((await response.json()).message)

        const data = await response.json()
        localStorage.setItem('CUR_USER', JSON.stringify(data))
        store.setSuccessMsg('资料变更成功！')
        router.push({ name: 'profile', params: { nickname: data.nickname } })
    } catch (e) {
        store.setErrorMsg(e.message)
    } finally {
        state.isLoading = false
    }
}

async function uploadAvatar() {
        const response = await uploadUserAvatar(state.newUser.avatar)
        if (!response.ok) throw new Error((await response.json()).message)

        state.newUser.avatar = (await response.json())[0]
}

async function uploadBanner() {
        const response = await uploadUserBanner(state.newUser.banner)
        if (!response.ok) throw new Error((await response.json()).message)

        state.newUser.banner = (await response.json())[0]
}

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

function showImageChangeProper(from) {
    state.imageChangeProper.show = true
    state.imageChangeProper.from = from
    switch (from) {
        case 'avatar':
            state.cropper.aspectRatio = 1
            break
        case 'banner':
            state.cropper.aspectRatio = 1.5
            break
        default:
            state.cropper.aspectRatio = 1
            break
    }
}

function handleImageChangeProperSelect({ select }) {
    state.imageChangeProper.select = select
    if (select === 'restore') {
        switch (state.imageChangeProper.from) {
            case 'avatar':
                state.newUser.avatar = undefined
                break;
            case 'banner':
                state.newUser.banner = undefined
                break;
            default:
                break;
        }
    }
}

function handleImageFile({ file }){
    switch (state.imageChangeProper.from) {
        case 'avatar':
            state.newUser.avatar = file
            break;
        case 'banner':
            state.newUser.banner = file
            break;
        default:
            break;
    }
}

function setAvatar({ avatar }) {
    state.newUser.avatar = avatar
}

onUnmounted(() => {
    store.clearCroppedImage()
})
</script>