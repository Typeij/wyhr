<template>
    <div class="index">

  
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>快捷菜单</span>
           
          </div>
        </template>
            <div class="box">
                <div @click="router.push(`/index/${item.powerUrl}`)" v-for="item in powerList" :key="item.id">
                    <div class="item">
                        <img :src="'../../../../public/img/'+item.powerUrl+'.png'" alt="" class="imgs">
                    
                    </div>
                    <div>
                    <span>{{ item.powerName }}</span>
                    </div>
                </div>
            </div>
        <template #footer>Footer content</template>
      </el-card>
      <!-- 统计 -->
            <el-card class="box-card" style="margin-top: 20px;">
        <template #header>
          <div class="card-header">
            <span>统计概览</span>
          </div>
        </template>
         <el-row>
            <el-col v-for="item in retList" :key="item.title" :span="6">
              <div class="record">
               
                <div>
                   <h4>
                    {{ item.title }}
                   </h4>
                </div>
                <div>
                  <el-progress  type="circle" :percentage="item.num"  />
                </div>
              </div>
            </el-col>
         </el-row>
      </el-card>
<!-- 人事概览 -->
          <el-card class="box-card" style="margin-top: 20px;">
            <template #header>
              <div class="card-header">
                <span>集团人事概览</span>
           
              </div>
            </template>
                <div class="box1">
                    <div v-for="item in resList" :key="item.id" class="menu">
                    <div class="menu_o">
                    <span>{{ item.title }}</span>
                    </div>
                        <div class="menu_t">
                             <h4>{{ item.num }}</h4>
                    
                        </div>

                    </div>
                </div>
            <template #footer>Footer content</template>
          </el-card>

            </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { UserIdpower, Showrecord } from '../../../servers/index'

import {  get } from '../../../utils/local'
import { useRouter } from "vue-router"// 引入路由
const router = useRouter()// 创建路由对象
const powerList = ref<any[]>([])
const retList = ref<any[]>([])
const resList = ref<any[]>([])
let params=reactive({ userId:''})
params.userId = get('userId')
onMounted(() => {
    ShowUserIdpower()
    recordData()
})
const ShowUserIdpower = () => {
    UserIdpower(params).then((res: any) => {
        if (res.meta.code == 200) {
            console.log(res)
            powerList.value = res.data.filter((item: any) => item.level==2)

            console.log(powerList);
        }
    })
}
const recordData = () => {
    Showrecord().then((res: any) => {
        if (res.meta.code == 200) {
            console.log(res)
            resList.value=res.data.dataView
            retList.value=res.data.recordView
        }
    })
}

</script>

<style scoped lang="less">
.box,.box1{
        display: flex;
        justify-content:space-between;
        margin-left: 10px;
    .item,.items{
        display: flex;
        justify-content: center;
    }

.imgs{
        width: 60px;
        height: 60px;
}


}
.record{
     border: 1px solid #f0f0f0;
      height: 200px;
      // width: 180px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      flex-direction: column;
      padding-bottom: 18px;
}
.index{
    overflow:auto;
    // border: 1px solid red;
    height: calc(100vh - 122px);
}
.box1{

    .menu{
        // border: 1px solid red;
        width: 200px;
        height: 100px;
        margin: 10px;
        background-color: #f9f9f9;
        border-radius: 5px;
        box-shadow: none; // 初始状态下没有阴影
        
        &:hover {
            box-shadow: 2px 2px 10px rgba(0,0,0,.5); // 鼠标滑入时添加阴影效果
        }

        .menu_o{
        
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 25px;
        }
                .menu_t{
            
        display: flex;
        justify-content: center;
        align-items: center;
        height: 30px;

        }
    }
}
</style>