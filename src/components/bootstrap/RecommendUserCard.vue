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
            </div>

            <div class="info d-flex flex-column justify-content-start">
                <div class="nickname">{{user.nickname}} <i class="bi bi-patch-check-fill verify" v-if="user.verified"></i></div>
                <div class="brief">{{user.brief}}</div>
            </div>

        </div>
        
    </div>
</template>

<style scoped>
@import url("bootstrap/dist/css/bootstrap.css");

.userCard:hover{
    background-color: #cfe2ffAA;
}

.userCard:active{
    background-color: #cfe2ff55;
}
.card-header{
    background-color: #cfe2ff11;
    font-size: 14pt;
    font-weight: bold;
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
    margin: 1rem 0rem 0rem 1rem !important;
    padding: 0.5rem 0rem 1rem 0rem !important;
    position: fixed;
    background-color: #cfe2ff77;
    padding: 1rem 0rem 0 1rem;
    border-radius: 12px;
}

.userCard {
    padding: 0.8rem 0.4rem;
    margin: 0 0.8rem;
    border-radius: 8px;
    column-gap: 1rem;
}

.verify {
    color: #0d6efd;
}

.bi {
    font-size: 11pt;
}

.avatar {
    border-radius: 8px;
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
                    "nickname":"Kotlin developer",
                    "brief":"Orginize develop mettings."
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