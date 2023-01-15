<template>
    <Transition>
        <div class="banner-container" v-if="hasError">
            <div class="alert alert-warning alert-dismissible fade show" role="alert">
                {{ store.GLOBAL_MSG }}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"
                    @click="closeBanner"></button>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
@import url("bootstrap/dist/css/bootstrap.css");

.btn-close:focus {
    outline: none;
    box-shadow: none;
}

.v-enter-active {
    animation: slide-in-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

.v-leave-active {
    animation: slide-out-top 0.5s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
}

@keyframes slide-in-top {
    0% {
        transform: translateY(-1000px);
        opacity: 0
    }

    100% {
        transform: translateY(0);
        opacity: 1
    }
}

@keyframes slide-out-top {
    0% {
        -webkit-transform: translateY(0);
        transform: translateY(0);
        opacity: 1;
    }

    100% {
        -webkit-transform: translateY(-1000px);
        transform: translateY(-1000px);
        opacity: 0;
    }
}

.banner-container {
    position: fixed;
    z-index: 200;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: center;
    align-items: center;
    pointer-events: none;
}

.alert {
    margin: 0;
    min-width: 25rem;
    max-width: 48rem;
    pointer-events: all;

    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    overflow: hidden;
}
</style>

<script>
import { store } from '@/store.js'

export default {
    data() {
        return {
            store
        }
    },
    methods: {
        closeBanner() {
            this.store.clearMsg()
        }
    },
    watch: {
    },
    computed: {
        hasError() {
            return this.store.GLOBAL_MSG.length > 0
        }
    }
}
</script>