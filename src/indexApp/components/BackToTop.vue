<template>
    <div class="bg-white dark:bg-[#1e1e1e] dark:ring-neutral-800 p-1 ring-1 ring-gray-100 rounded-[8px] shadow-md text-center">
        <span
            class="dark:text-white/75 material-symbols-rounded no-hover"
            title="返回顶部">
            keyboard_capslock
        </span>
    </div>
</template>

<style scoped>
.material-symbols-rounded{
    font-size: 1.25rem;
    transition: padding 100ms ease-in-out 100ms;
}

.material-symbols-rounded:hover{
    padding: 0.75rem;
}
</style>