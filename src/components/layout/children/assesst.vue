<template>
        <div class="title">
            <el-icon size="20px">
                <Grid />
            </el-icon>
            <div class="wenz">
                <span>考核明细</span>
            </div>
        </div>
        <!-- 表格 -->
         <el-table
          :data="tableData"
          border
          style="width: 100%; margin-top:20px"
          max-height="450" 
        >
          <el-table-column prop="positionName" label="职位" width="180" />
          <el-table-column prop="describe" label="描述" />
          <el-table-column prop="name" label="考核" >
            <el-table-column prop="name" label="上域" >
            <template #default="{ row }">
            <p v-for="item in row.list" :key="item.id" class="itp">
               <span v-if="!item.isemit">{{ item.maxMark }}</span> 
               <span v-else><el-input v-model="item.maxMark"></el-input></span>
            </p>
            </template>
              </el-table-column>
            <el-table-column prop="name" label="下域" >
              <template #default="{ row }">
              <p v-for="item in row.list" :key="item.id" class="itp">
                 <span v-if="!item.isemit">{{ item.minMark }}</span> 
                 <span v-else><el-input v-model="item.minMark"></el-input></span>
              </p>
              </template>


            </el-table-column>
            <el-table-column prop="name" label="系数" >
                <template #default="{ row }">
                <p v-for="item in row.list" :key="item.id" class="itp">
                   <span v-if="!item.isemit">{{ item.coefficient}}</span> 
                 <span v-else><el-input v-model="item.coefficient"></el-input></span>
                </p>
                </template>

              </el-table-column>
            <el-table-column prop="name" label="等级" >
                              <template #default="{ row }">
                  <p v-for="item in row.list" :key="item.id" class="itp">
                     <span v-if="!item.isemit">{{ item.countName }}</span> 
                 <span v-else><el-input v-model="item.countName"></el-input></span>
                  </p>
                  </template>
             </el-table-column>
            <el-table-column prop="name" label="操作" width="180">
                                <template #default="{ row }">
                    <p v-for="item,index in row.list" :key="item.id" class="itp">
                      <span v-if="!item.isadd">
                      <span v-if="!item.isemit">
                           <el-button type="primary"  size="small" @click="emit(item)">编辑</el-button>
                        <!-- <el-button type="danger" size="small" >删除</el-button> -->
                                   <el-popconfirm title="确认删除吗？"
          confirm-button-text="确定"
        cancel-button-text="取消"
        @confirm="del(item.id)"
        >
        <template #reference>
         <el-button type="danger" size="small">删除</el-button>
        </template>
      </el-popconfirm>
                      </span>
                        <span v-else>
                             <el-button type="primary"  size="small" @click="okeychange(item)">确定修改</el-button>
                          <el-button type="default" size="small" @click="closechange(item)">取消修改</el-button>
                          <!-- <el-button type="default" size="small" @click=" item.isemit = false">取消修改</el-button> -->
                        </span>
                          </span>
                                <span v-else>
                               <el-button type="primary"  size="small" @click="okeyadd(item,row.id)">确定添加</el-button>
                            <el-button type="default" size="small" @click="row.list.splice(index,1)">取消添加</el-button>
                          </span>
                    </p>
                    </template>
              </el-table-column>
          </el-table-column>
                      <el-table-column prop="name" label="操作" >
                     <template #default="{ row }">
                        <el-button type="primary" @click="addlist(row)">添加</el-button>
  

                        </template>
                  </el-table-column>
        </el-table>
          <!-- 分页组件 -->
    <el-pagination class="pages" background layout="prev, pager, next" :total="totalPage * 5" @current-change="page" />
</template>

<script setup lang="ts">
import { SerassessmenCount, Changeassesst, Addassesst, Delassesst } from '../../../servers/index'
import { ElMessage } from 'element-plus'//弹出框
import { onMounted, reactive, ref } from 'vue'
let params=reactive({pageNum:1,pageSize:2})
let tableData=ref([])
let totalPage: any = ref(1)

const SerassessmenCountData=()=>{
    SerassessmenCount(params).then((res:any)=>{
          if(res.meta.code==200){
              console.log(res)
              tableData.value=res.data
                totalPage.value = res.pages.total
          }
    })
}

onMounted(()=>{
    SerassessmenCountData()
})

const emit=(item:any)=>{
  console.log(item)
  item.isemit=true
}
const addlist=(row:any)=>{
  // let t=rese.list.findIndex(item=>item.id==row.id)
  let t=row.list.some((item:any)=>item.isadd)
  if(t){
    ElMessage.warning('请先确认添加')
    return
  }

  let obj= {
      id:'',
      positionId:'',
      maxMark:'',
      minMark:'',
      coefficient:'',
      countName:'',
      isemit:true,
      isadd:true
    }
    row.list.push(obj)
}
//取消修改
const closechange=(item:any)=>{
    item.isemit=false
    // SerassessmenCountData()
}
// 确定修改
const okeychange=(data:any)=>{
    // console.log(data)
   const { positionId,isemit,isadd,...rest}=data
   console.log(rest)
   Changeassesst(rest).then((res:any)=>{
      if(res.meta.code==200){
          ElMessage.success(res.meta.msg)
          data.isemit = false
          SerassessmenCountData()
      }
   })
}
// 确定添加
const okeyadd=(data:any, ids:any)=>{
     const { id, isemit, isadd, positionId, ...rest } = data
    let params={
      positionId:ids,
      ...rest
    }
  console.log(params)
  Addassesst(params).then((res:any)=>{
        if(res.meta.code==200){
            ElMessage.success(res.meta.msg)
            data.isemit = false
            SerassessmenCountData()
        }
  })
}
//删除
const del=(id:any)=>{
    console.log(id)
    Delassesst({id}).then((res:any)=>{
        if(res.meta.code==200){
          ElMessage.success(res.meta.msg)
          SerassessmenCountData()
        }
    })
}
// 分页逻辑
const page = (val: number) => {
  // console.log(`current page: ${val}`)
  params.pageNum = val
 SerassessmenCountData()
}
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
    bottom: 40px;
}
.itp{
  height: 30px;
  text-align: center;
    border-bottom: 1px solid gainsboro;
}
</style>