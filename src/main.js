import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/dist/index.css'
import './styles/index.scss'
import App from './App.vue'
import router from '@router/index'
import pinia from '@store/index'

import { permission } from '@directive/permission'
import { debounce } from '@directive/debounce'

const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(ElementPlus, {
  locale: zhCn
})

app.directive('permission', permission)
app.directive('debounce', debounce)

app.mount('#app')