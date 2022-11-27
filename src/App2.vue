<script setup>
import GlobalBanner from './components/bootstrap/GlobalBanner.vue';
import Auth from './components/tailwind/Auth.vue'
</script>

<template>
    <div class="container">
        <GlobalBanner></GlobalBanner>
        <Auth></Auth>
    </div>
</template>

<style>
@import url("bootstrap-icons/font/bootstrap-icons.css");

#header {
    position: fixed;
    width: 100%;
    z-index: 99;
}

#sidebar {
    position: fixed;
    left: 13rem;
    top: 5rem;
}

main {
    width: 40%;
    padding-top: 5rem;
    position: absolute;
    left: 28%;
    right: 28%;
}
</style>
