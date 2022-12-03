<template>
    <ul class="nav nav-pills justify-content-center">
        <a class="navbar-brand align-middle" id="brand" href="#">
            <img src="../../assets/logo.svg" alt="" width="25" height="25">
        </a>
        <li class="nav-item">
            <a class="nav-link" :class="{active: isChooseArr[0]}" @click="choose(0)" aria-current="page" href="#">主页</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" :class="{active: isChooseArr[1]}" @click="choose(1)" href="#">热门</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" :class="{active: isChooseArr[2]}" @click="choose(2)" href="#">消息</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" :class="{active: isChooseArr[3]}" @click="choose(3)" href="#">{{name}}</a>
        </li>
    </ul>
</template>

<script>
export default {
    data() {
        return {
            name: (JSON.parse(localStorage.getItem("CUR_USER"))).nickname,
            isChooseArr: [true, false, false, false]
        }
    },
    methods: {
        choose(itemIdx) {
            this.isChooseArr.fill(false)
            this.isChooseArr[itemIdx] = true
        }
    }
}
</script>

<style scoped>
@import url("bootstrap/dist/css/bootstrap.css");

li {
    margin: 1rem 0;
    font-size: 11pt;
}

ul {
    background-color: rgb(255 255 255 / 84%);
    backdrop-filter: blur(25px);
}

.nav {
    column-gap: 2rem;
}

.nav-link,.active {
    border-radius: 50rem !important;
}

#brand{
    display: flex;
    align-items: center;
    position: relative;
    left: -14%;
}
</style>