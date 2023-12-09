<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <span class="im">Header</span>
        <span class="out" @click="outlogin()"> 退出登录</span>
      </el-header>
      <el-container>
        <el-aside style="width: 200px;">
<!-- 侧边栏 -->
 <el-col :span="12">
      <el-menu
      style="height:calc(100vh - 60px);width: 200px;"
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="el-menu-vertical-demo"
        :default-active="currentPath"
        text-color="#fff"
        :unique-opened="true"
      >

        <!-- <el-menu-item index="2">
          <el-icon><icon-menu /></el-icon>
          <span>控制台</span>
        </el-menu-item> -->

          <el-menu-item @click="toctrl('/index/ctrl')" index="ctrl">
<el-icon><icon-menu /></el-icon>
        控制台
      </el-menu-item>

        <el-sub-menu :index="item.powerUrl" v-for="item in munList" :key="item.id">
          <template #title>
            <el-icon>
              <!-- <location /> -->
                <Component :is="icon[item.powerUrl]" />
            </el-icon>
            <span>{{ item.powerName }}</span>
          </template>
            <el-menu-item :index="it.powerUrl" v-for="it in item.children" :key="it.id"  @click="goToPage('/index/' + it.powerUrl)">
               
                 <span>{{ it.powerName }}</span>
            </el-menu-item>
            <!-- <el-menu-item index="1-2">item two</el-menu-item> -->
        </el-sub-menu>


      </el-menu>
    </el-col>
        </el-aside>
        <el-main>
          <bread v-if="currentPath!='ctrl'"></bread>
          <RouterView></RouterView>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
// import { onMounted,ref } from 'vue';
// import {GetPower} from '../../servers/index'
import { get ,clear} from "../../utils/local";
// import {dataTree} from "../../utils/datatree"
import {useRouter} from "vue-router"// 引入路由
import { useRoute } from "vue-router";
const router=useRouter()// 创建路由对象
const route=useRoute()
import {bread} from '../../components/Breadcrumb/index'
import {setbreadList,setCrrentPath,currentPath} from '../../hooks/breadHooks'
// console.log(currentPath)

let munList=get("menu")
// console.log(munList)
// 侧边栏逻辑
import {
  // Document,
  Menu as IconMenu,
  Location,
  // Setting,
} from '@element-plus/icons-vue'
import { watch } from "vue";
// const handleOpen = (key: string, keyPath: string[]) => {
//   console.log(key, keyPath)
// }
// const handleClose = (key: string, keyPath: string[]) => {
//   console.log(key, keyPath)
// }
const icon: any = {// 图标枚举
  auth: 'Files',
  emp: 'User',
  assess: 'Document',
  train: 'Reading',
  payment: 'DocumentChecked'
}
const outlogin=()=>{
    clear()
    router.push("/login")
}
const goToPage = (path: string) => {
  router.push(path);
};

const toctrl=(path:string)=>{
  router.push(path);
}

//监听路由变化，面包屑
watch(route,(n)=>{
  // console.log(n)
  setbreadList(n.meta.list as string[])
  setCrrentPath(n.name as string)

},{deep:true,immediate:true})



</script>

<style scoped lang="less">
.el-header{
    height: 60px;
    background-color: #373d41;
    line-height: 60px;
    .out{
        margin-left: 90%;
    }

}
.el-main{
  height: calc(100vh- 60px);
  // border: 1px solid red;
  margin: 10px;
  background-color: white;
}

</style>
