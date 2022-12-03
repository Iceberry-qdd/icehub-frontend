<template>
    <ul class="list-group">
        <li @click="routeTo('/')" class="active list-group-item list-group-item-action d-flex justify-content-between align-items-center">
            <div class="menu">
                <i class="bi bi-house-door-fill"></i>
                主页
            </div>

            <span class="badge bg-primary rounded-pill">99+</span>
        </li>
        <li class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
            <div class="menu">
                <i class="bi bi-compass-fill"></i>
                探索
            </div>

            <span class="badge bg-primary rounded-pill">14</span>
        </li>
        <!-- <router-link to="/bookmark"></router-link> -->
        <li @click="routeTo('/bookmark')" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
            <div class="menu">
                <i class="bi bi-bookmark-fill"></i>
                书签
            </div>

            <span class="badge bg-primary rounded-pill"></span>
        </li>
        <li class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
            <div class="menu">
                <i class="bi bi-file-person-fill"></i>
                个人资料
            </div>

            <span class="badge bg-primary rounded-pill"></span>
        </li>
        <li class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
            <div class="menu">
                <i class="bi bi-wallet-fill"></i>
                钱包
            </div>

            <span class="badge bg-primary rounded-pill"></span>
        </li>
        <li class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
            <div class="menu">
                <i class="bi bi-award-fill"></i>
                勋章
            </div>

            <span class="badge bg-primary rounded-pill"></span>
        </li>
        <li class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
            <div class="menu">
                <i class="bi bi-balloon-fill"></i>
                活动
            </div>

            <span class="badge bg-primary rounded-pill"></span>
        </li>
        <li class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
            <div class="menu">
                <i class="bi bi-kanban-fill"></i>
                管理
            </div>

            <span class="badge bg-primary rounded-pill"></span>
        </li>
        <li class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
            <div class="menu">
                <i class="bi bi-gear-fill"></i>
                设置
            </div>

            <span class="badge bg-primary rounded-pill"></span>
        </li>
    </ul>
</template>

<style scoped>
@import url("bootstrap/dist/css/bootstrap.css");

.active{
    background-color: #cfe2ff !important;
    color: black;
}

.badge {
    background-color: #0d6efd !important;
    border-radius: 4rem !important;
}

.list-group {
    width: 14%;
    /* margin-right: 4%;
    float: right; */
    position: fixed;
    left:15%;
}

.list-group-item {
    border: 0;
    height: 3.5rem;
    border-radius: 50rem !important;
    margin: 0.2rem;
}

.bi {
    font-size: 14pt;
    margin-right: 1rem;
}
</style>

<script>
export default {
    data() {
        return {
            a:1
        }
    },
    methods: {
        routeTo(url){
            this.$router.push(url)
        }
    },
    computed: {

    }
}
</script>