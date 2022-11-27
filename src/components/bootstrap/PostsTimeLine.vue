<template>
    <div>
        <PostEditor @get-data="getData" id="post-editor"></PostEditor>
        <PostCard v-for="(post, index) in posts" :post="post" :key="post.id" :index="index"></PostCard>
        <div class="ending">
            <s>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</s>&#8226;<s>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</s>
        </div>
    </div>

</template>

<style scoped>
.ending {
    color: lightgray;
    text-align: center;
    margin-bottom: 0.4rem;
    font-weight: lighter;
}

#post-editor {
    margin-bottom: 0.5rem;
}
</style>

<script>
import PostCard from './PostCard.vue'
import { getTimeline } from '../../api.js'
import { store } from '../../store.js'
import PostEditor from '../tailwind/PostEditor.vue'


export default {
    components: {
        PostCard,
        PostEditor
    },
    data() {
        return {
            posts: [],
            store,
            pageIdx: 1,
            pageSize: 10
        }
    },
    methods: {
        async getData(pageIdx, pageSize) {
            try {
                const response = await getTimeline(pageIdx, pageSize)
                if (!response.ok) throw new Error(await response.text())

                const { content } = await response.json()
                this.posts.push(...content)
            } catch (e) {
                this.store.setMsg(e.message)
                console.error(e)
            }
        },
        fetchNewPost() {
            let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
            let clientHeight = document.documentElement.clientHeight
            let scrollHeight = document.documentElement.scrollHeight

            if (scrollTop + clientHeight >= scrollHeight) {
                // console.log("已触底")
                this.pageIdx++;
                setTimeout(() => { }, 3000)
                this.getData(this.pageIdx, this.pageSize)
            }
        }
    },

    created() {
        this.getData(this.pageIdx, this.pageSize)
        window.addEventListener('scroll', this.fetchNewPost)
    },
    unmounted() {
        window.removeEventListener('scroll', this.fetchNewPost)
    }
}

</script>