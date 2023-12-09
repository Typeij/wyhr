<template>
      <div class="title">
        <el-icon size="20px">
          <Grid />
        </el-icon>
        <div class="wenz">
          <span>权限列表</span>
        </div>
      </div>
      <!--  -->
              <el-table
            :data="powerDataList"
            style="width: 100%; margin-bottom: 20px"
            row-key="id"
          >
            <el-table-column prop="id" label="id"  />
            <el-table-column prop="powerName" label="名称"/>
            <el-table-column prop="powerUrl" label="权限" />
            <el-table-column prop="level" label="等级" >
                          <template #default="{ row }">
                    <el-tag :type="row.level == 1 ? 'success' : ''" >
                      {{ row.level == 1 ? '一级权限' : '二级权限' }}
                    </el-tag>
                  </template>
         </el-table-column>
          </el-table>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { GetAllpower  } from '../../../servers/index'

let powerDataList =ref([])
const getAP=()=>{
    GetAllpower().then((res:any)=>{
        if(res.meta.code==200){
            console.log(res.data)
            powerDataList.value=res.data
        }
    })
}
onMounted(()=>{
    getAP()
})
</script>

<style scoped lang="less">
.title {
    margin-top: 10px;
    height: 30px;
    display: flex;

    .el-icon {
        margin-top: 5px;
    }

    .wenz {
        line-height: 30px;
        margin-left: 10px;

    }

    .el-button {
        position: absolute;
        right: 30px;
    }

}

.pages {
    position: absolute;
    bottom: 70px;
}
</style>