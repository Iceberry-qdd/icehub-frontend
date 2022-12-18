<template>
    <div>
        <div>
            <div class="banner-cover">
                <span class="material-icons-round">edit</span>
            </div>
            <div class="avatar-cover">
                <span class="material-icons-round">edit</span>
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
                    <input v-model.trim="state.newUser.nickname" type="text" class="form-control is-invalid"
                        id="floatingInput" placeholder="用户名" required>
                    <label for="floatingInput">用户名</label>
                    <!-- <div class="valid-feedback">Looks good!</div> -->
                    <div class="invalid-feedback">此用户名已被使用！</div>
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
                    <input v-model.trim="state.newUser.age" type="number"
                        :class="[isAgeValid.valid ? 'is-valid' : 'is-invalid']" class="form-control" id="floatingInput"
                        placeholder="年龄">
                    <label for="floatingInput">年龄</label>
                    <div class="invalid-feedback">{{ isAgeValid.msg }}</div>
                </div>
                <div class="form-floating mb-3">
                    <input v-model.trim="state.newUser.gender" type="text" class="form-control" id="floatingInput"
                        placeholder="性别">
                    <label for="floatingInput">性别</label>
                </div>
                <div class="form-floating mb-3">
                    <input v-model.trim="state.newUser.email" type="email" :class="[isEmailValid.valid ? 'is-valid' : 'is-invalid']" class="form-control" id="floatingInput"
                        placeholder="电子邮件">
                    <label for="floatingInput">电子邮件</label>
                    <div class="invalid-feedback">{{ isEmailValid.msg }}</div>
                </div>
                <div class="form-floating mb-3">
                    <input v-model.trim="state.newUser.phoneNumber" type="tel" :class="[isPhoneNoValid.valid ? 'is-valid' : 'is-invalid']" class="form-control" id="floatingInput"
                        placeholder="手机号码">
                    <label for="floatingInput">手机号码</label>
                    <div class="invalid-feedback">{{ isPhoneNoValid.msg }}</div>
                </div>
                <div class="form-floating mb-3">
                    <input type="url" class="form-control" id="floatingInput" placeholder="手机号码">
                    <label for="floatingInput">个人网站</label>
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
</style>

<script setup>
import { reactive, computed } from 'vue';

const state = reactive({
    user: JSON.parse(localStorage.getItem("CUR_USER")),
    newUser: JSON.parse(localStorage.getItem("CUR_USER"))
})

const formattedDate = computed(() => {
    const timestamps = state.user.createdTime
    const date = new Date(Number.parseInt(timestamps))
    return `${date.getFullYear()}年${date.getMonth()}月${date.getDate()}日`
})

const bannerPic = computed(() => {
    const bannerUrl = state.user.bannerUrl
    if (bannerUrl == null) return '/src/assets/default-bg.jpg'
    else return bannerUrl
})

const avatarPic = computed(() => {
    if (state.user.avatarUrl == null) {
        return `https://api.multiavatar.com/${state.user.nickname}.svg`
    } else {
        return props.post.user.avatarUrl
    }
})

const isAgeValid = computed(() => {
    if (!state.newUser.age.toString().match('^[0-9]+$')) {
        return { 'valid': false, 'msg': '您输入的不是一个有效的年龄' }
    }

    if (state.newUser.age < 0) {
        return { 'valid': false, 'msg': '年龄不能小于0！' }
    }

    if (state.newUser.age > 128) {
        return { 'valid': false, 'msg': '此年龄值超出范围！' }
    }

    return { 'valid': true, 'msg': '' }
})

const isEmailValid=computed(()=>{
    if(!state.newUser.email) state.newUser.email=''

    if(state.newUser.email.toString().match('^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$')){
        return { 'valid': true, 'msg': '' }
    }

    return { 'valid': false, 'msg': '您输入的不是一个有效的邮箱地址！' }
})

const isPhoneNoValid=computed(()=>{
    if(!state.newUser.phoneNumber) state.newUser.phoneNumber=''

    if(state.newUser.phoneNumber.toString().match('^\\+?([0-9]+-?)+$')){
        return { 'valid': true, 'msg': '' }
    }

    return { 'valid': false, 'msg': '您输入的不是一个有效的手机号码！' }
})
</script>