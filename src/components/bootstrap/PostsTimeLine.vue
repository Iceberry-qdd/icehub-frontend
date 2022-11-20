<template>
    <div>
        <PostEditor @get-data="getData" id="post-editor"></PostEditor>
        <PostCard v-for="(post, idx) in this.posts" :post="post"></PostCard>
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
import { getImgRealUrl, getTimeline } from '../../api.js'
//import postList from '../../mock/posts.json'
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
            //const BASE_IMAGE_URL = 'http://localhost:9000'
            try {
                const response = await getTimeline(pageIdx, pageSize)
                if (!response.ok) throw new Error(await response.text())

                const { content } = await response.json()
                // content.forEach(e => {
                //     // console.log(e)
                //     e.attachmentsUrl.forEach(url =>{
                //         url=`${BASE_IMAGE_URL}/${url}`
                //         console.log(url)
                //     })
                // });
                this.posts.push(content)
                // content.forEach(async e => {
                //     const realUrls = await this.getImgsUrl(e.attachmentsUrl)
                //     // console.log(realUrls)
                //     e.attachmentsUrl = realUrls
                //     this.posts.push(e)
                //     // console.log(e)
                // });
                // console.log(content)
                // this.posts.push(...content)
            } catch (e) {
                this.store.setMsg(e.message)
                console.error(e)
            }
        },
        // async getImgsUrl(urls) {
        //     let result = []
        //     try {
        //         for (let i = 0; i < urls.length; i++) {
        //             const response = await getImgRealUrl(urls[i])
        //             if (!response.ok) throw new Error(await response.text())

        //             const data = await response.text()
        //             result.push(data)
        //         }
        //     } catch (e) {
        //         this.store.setMsg(e.message)
        //         console.error(e)
        //     }
        //     return result
        // },
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
        // console.log("a")
        this.getData(this.pageIdx, this.pageSize)
        window.addEventListener('scroll', this.fetchNewPost)
    },
    unmounted() {
        window.removeEventListener('scroll', this.fetchNewPost)
    }
}

</script>