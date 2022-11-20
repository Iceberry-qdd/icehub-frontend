<template>
    <ul class="list-group">
        <li class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
            <div class="menu">
                <i class="bi bi-compass-fill"></i>
                圈子
            </div>

            <span class="badge bg-primary rounded-pill">99+</span>
        </li>
        <li class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
            <div class="menu">
                <i class="bi bi-person-plus-fill"></i>
                关注
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

.badge {
    background-color: #0d6efd !important;
    border-radius: 4rem !important;
}

.list-group {
    width: 13rem;
}

.list-group-item {
    border: 0;
    height: 4rem;
}

.bi {
    font-size: 14pt;
    margin-right: 1rem;
}
</style>

<script>
// import router from '../../route';

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