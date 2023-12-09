import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'// 引入组件库
import 'element-plus/dist/index.css'// 引入组件库全局样式
import router from './router'// 引入路由

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import JsonExcel from 'vue-json-excel'
import * as XLSX from 'xlsx'







const app = createApp(App)
app.use(router)// 挂载路由
app.use(ElementPlus)
app.mount('#app')
app.component('downloadExcel', JsonExcel)
app.component('download', XLSX)


for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
