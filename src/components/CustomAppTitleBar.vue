<template>
    <div
        id="app-title-bar"
        class="box-border flex gap-x-2 items-center px-3">
        <div class="bg-[url('/favicon.ico')] bg-center bg-contain bg-no-repeat icon" />
        <span class="dark:text-white/75 text-gray-500 title">Icehub</span>
    </div>
</template>

<style scoped>
#app-title-bar {
    app-region: drag;
    --webkit-app-region: drag;
    height: env(titlebar-area-height, 0);
    width: env(titlebar-area-width, 0);
    left: env(titlebar-area-x, 0);
}

#app-title-bar>.icon {
    height: calc(env(titlebar-area-height, 0px) / 2);
    width: calc(env(titlebar-area-height, 0px) / 2);
}

#app-title-bar>.title {
    font-size: min(calc(env(titlebar-area-height, 0px) / 2), 0.9rem);
}
</style>

<script setup>
</script>