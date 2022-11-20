import { createApp } from 'vue'
import 'bootstrap'
import App from './App.vue'

import './assets/main.css'
import router from './route'
// import 'bootstrap/dist/css/bootstrap.css'



createApp(App).use(router).mount('#app')
