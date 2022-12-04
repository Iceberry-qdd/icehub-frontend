<template>
    <PostCard v-if="state.post!=null" :post="state.post"></PostCard>

</template>

<style scoped>

</style>

<script setup>
import { onMounted, reactive } from 'vue';
import PostCard from '../bootstrap/PostCard.vue';
import { getPostById } from '../../api.js'
import { store } from '../../store';

const state = reactive({
    post: null
})

async function getPost() {
    try {
        console.log('a')
        const response = await getPostById(store.SELECT_POST_ID)
        if (!response.ok) throw new Error(await result.text())

        state.post = await response.json()
    } catch (e) {
        store.setMsg(e.message)
        console.error(e)
    }

}

onMounted(() => {
    getPost()
    console.log(state.post)
})

</script>