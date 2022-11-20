<template>
    <div class="offcanvas offcanvas-end" :class="{show:isShow,hiding:!isShow}" tabindex="-1" id="offcanvasRight"
        aria-labelledby="offcanvasRightLabel">
        <div class="offcanvas-header">
            <img src="../../assets/avatar2.jpg" class="offcanvas-header-img">
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"
                @click="closeOffCanvas"></button>

            <div class="user-info">
                <img class="avatar img-fluid" src="../../assets/avatar.jpg" width="64" height="64">
                <div class="user-nickname">
                    <div class="nickname">{{store.GLOBAL_SELECT_UID}}</div>
                    <i class="bi bi-patch-check-fill verify"></i>
                    <i class="bi bi-gender-female"></i>
                    <i class="bi bi-gender-male"></i>
                </div>
                <div class="city">
                    <i class="bi bi-geo-alt-fill"></i>
                    北京市
                </div>
                <div class="birth">
                    <i class="bi bi-egg-fill"></i>
                    2000-09-01
                </div>
                <div class="brief">这个人什么也没写</div>
            </div>
        </div>
        <div class="offcanvas-body">
            <PostsTimeLine class="posts"></PostsTimeLine>
        </div>
    </div>
</template>

<style scoped>
@import url("bootstrap/dist/css/bootstrap.css");

.offcanvas-body{
    margin-top: 10rem;
    height: fit-content;
}
.posts{
    width: fit-content;
}

.btn-close{
    background-color: #EEEEEE;
    border-radius: 4rem;
}
.brief,.city,.birth{
    font-size: 10pt;
}
.bi-gender-female{
    color: rgb(250, 104, 128);
}

.bi-gender-male{
    color: #0d6efd;
}

.nickname{
    font-size: 16pt;
    font-weight: bold;
}
.verify{
    color: #0d6efd;
}

.user-nickname {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    column-gap: 0.5rem;
    justify-content: flex-start;
    align-items: center;
}

.user-info {
    position: absolute;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    width: 100%;
    top: 13rem;
    left: 1.5rem;
    row-gap: 0.5rem;
}

.avatar {
    border-radius: 16%;
    border: 3px solid white;
}

.offcanvas-end {
    width: 30rem !important;
    box-shadow: -1px 0 0.5rem 0px rgb(0 0 0 / 8%);
}

.offcanvas-header {
    padding: 0;
    height: 15rem;
}

.offcanvas-header-img {
    /* position: absolute;
    width: 100%;
    top: 0px;
    height: 15rem; */
    height: 100%;
    width: 100%;
    object-fit: cover;
}

.btn-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
}
</style>

<script>
import { store } from '../../store.js'
import PostsTimeLine from './PostsTimeLine.vue'
import postList from '../../mock/posts.json'

export default {
    data() {
        return {
            store,
            posts: postList
        };
    },
    methods: {
        closeOffCanvas() {
            store.clearSelectUid();
        }
    },
    computed: {
        isShow() {
            return store.GLOBAL_SELECT_UID != null;
        }
    },
    components: { PostsTimeLine }
}
</script>