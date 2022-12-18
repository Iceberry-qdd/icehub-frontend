<template>

    <div v-if="isShow" id="carouselExampleControls" class="carousel slide carousel-fade" data-bs-interval="false">
        <button @click="close" type="button" class="btn-close" aria-label="Close"></button>
        <div class="carousel-inner">
            <div class="carousel-item" :class="{ active: idx == this.store.SLIDE_DATA.curIdx }"
                v-for="(img, idx) in this.store.SLIDE_DATA.urls" :key="idx">
                <img :src="img" class="d-block m-img" alt="...">
            </div>

        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls"
            data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls"
            data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
        </button>
    </div>
</template>

<style scoped>
@import url("bootstrap/dist/css/bootstrap.css");

.btn-close{
    display: flex;
    position: fixed;
    margin: 1rem 1rem;
    padding: 0.8rem 0.8rem;
    background-color: white;
    border-radius: 99rem;
    z-index: 103;
}

#carouselExampleControls {
    position: fixed;
    height: 100%;
    width: 100%;
    z-index: 105;

    background-color: #000000cc;
}

.carousel-inner {
    width: 100%;
    height: 100%;
    /* display: flex;
    justify-content: center;
    align-items: center; */
}

.m-img {
    max-width: 80vw;
    max-height: 100vh;
}

.carousel-item.active {
    display: flex;
    justify-content: center;
}
</style>

<script>
import { store } from '../../store.js'
export default {
    data() {
        return {
            imgs: [],
            store,
        }
    },
    methods: {
        close() {
            this.store.dismissSlide()
            document.querySelector("body").removeAttribute("style","overflow:hidden")
        }
    },
    computed: {
        isShow() {
            return this.store.SLIDE_DATA.urls.length > 0
        }
    }
}
</script>