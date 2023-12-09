// 通信 保存当前路由所对应的面包屑数据 

import { ref } from "vue";
// ['权限管理','账号信息']
export const breadList = ref<string[]>([])// 面包屑数据
export const currentPath = ref<string>("index")// 当前高亮
export const setbreadList = (list: string[]) => {// list ['权限管理','账号信息']
    breadList.value = list
}
export const setCrrentPath = (path: string) => {
    currentPath.value = path
}