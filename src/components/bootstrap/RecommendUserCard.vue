<template>
    <div class="card">
        <div class="card-header">
            猜你喜欢
            <i class="bi bi-arrow-clockwise"></i>
        </div>
        <div class="userCard list-group-item d-flex align-items-center" v-for="user in users">
            <div class="avatar">
                <a href="#">
                    <img class="avatar" :src="user.avatar" width="60" height="60">
                </a>
                <i class="bi bi-patch-check-fill verify" v-if="user.verified"></i>
            </div>

            <div class="info d-flex flex-column justify-content-start">
                <div class="nickname">{{user.nickname}}</div>
                <div class="brief">{{user.brief}}</div>
            </div>

        </div>
        
    </div>
</template>

<style scoped>
@import url("bootstrap/dist/css/bootstrap.css");

.userCard:hover{
    background-color: #f5f5f5;
}

.userCard:active{
    background-color: #e9ecef;
}
.card-header{
    background-color: white;
    
}

.nickname{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-weight: bold;
}

.brief{
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    font-size: small;
}

.info{
    width: 14rem;
}

.card {
    margin-bottom: 0.5rem;
    /* padding: 0.4rem 0.4rem 1rem 0.8rem !important; */
    padding: 0.4rem 0rem 0rem 0rem !important;
    position: fixed;
    /* left: 68.6%;
    top: 5rem; */
    /* width: 20rem; */
}

.userCard {
    padding: 0.8rem 0.8rem 0.8rem 0.8rem;
    column-gap: 1rem;
}

.verify {
    position: absolute;
    left: 64px;
    top: 60px;
    color: #0d6efd;
}

.bi {
    font-size: 1.0rem;
    margin-right: 0.3rem;
}

.card {
    margin-bottom: 0.5rem;
    padding: 1rem 1rem 0 1rem;
}

.avatar {
    border-radius: 16%;
}
</style>

<script>

export default {
    data() {
        return {
            users: [
                { 
                    "avatar":"https://api.multiavatar.com/Iceberry.svg",
                    "verified":true,
                    "nickname":"Iceberry",
                    "brief":"国家剧团作家，做有《家有儿女》等"
                },
                { 
                    "avatar":"https://api.multiavatar.com/Iceberryss.svg",
                    "verified":true,
                    "nickname":"Iceberry新一轮较强冷空气将影响中国中东部大部地区，继续带来大风降温天气。受冷空气影响",
                    "brief":"国家剧团作家，做有《家有儿女》等,新一轮较强冷空气将影响中国中东部大部地区，继续带来大风降温天气。受冷空气影响"
                },
                { 
                    "avatar":"https://api.multiavatar.com/Iceberrys.svg",
                    "verified":true,
                    "nickname":"Iceberrys",
                    "brief":"国家剧团作家，做有《家有儿女》等"
                }
            ]
        }
    },
    methods: {

    },
    computed: {

    },

}   
</script>