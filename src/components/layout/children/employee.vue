<template>
<div v-if="!condition">
          <div class="title">
            <el-icon size="20px">
              <Grid />
            </el-icon>
            <div class="wenz">
              <span>员工列表</span>
            </div>
            <el-button type="primary" @click="jumpEmdata(null)">
              <el-icon style="margin-top: 1px;">
                <Plus />
              </el-icon>
              <span>添加员工</span>

            </el-button>
          </div>
          <!-- 表格 -->
             <el-table :data="dataList" border style="width: 100%;margin-top: 10px;">
        <el-table-column type="expand">
          <template #default="props">
            <div m="4" class="fold">
                  <el-descriptions>
            <el-descriptions-item label="姓名:">{{ props.row.name }}</el-descriptions-item>
            <el-descriptions-item label="性别:">{{ props.row.sex }}</el-descriptions-item>
            <el-descriptions-item label="电话:">{{ props.row.tel }}</el-descriptions-item>
            <el-descriptions-item label="年龄:">{{ props.row.age }}</el-descriptions-item>
            <el-descriptions-item label="身份证:">{{ props.row.idCard }}</el-descriptions-item>
            <el-descriptions-item label="籍贯:">{{ props.row.NativePlace }}</el-descriptions-item>
            <el-descriptions-item label="学历:">{{ props.row.name }}</el-descriptions-item>
            <el-descriptions-item label="毕业院校:">{{ props.row.education }}</el-descriptions-item>
            <el-descriptions-item label="部门:">{{ props.row.depName }}</el-descriptions-item>
            <el-descriptions-item label="业务:">{{ props.row.major }}</el-descriptions-item>
            <el-descriptions-item label="职位:">{{ props.row.positionName }}</el-descriptions-item>
            <el-descriptions-item label="入职时间:">{{ new Date(props.row.entryTime).toLocaleString() }}</el-descriptions-item>
            <el-descriptions-item label="底薪:">{{ props.row.assessmentSalary }}</el-descriptions-item>
            <el-descriptions-item label="薪酬:">{{ props.row.salary }}</el-descriptions-item>
          </el-descriptions>
            </div>

          </template>
        </el-table-column>
        <el-table-column label="id" prop="id" width="50"/>
        <el-table-column label="姓名" prop="name" width="150"/>
        <el-table-column label="部门" prop="depName" />
        <el-table-column label="职位" prop="positionName" />
        <el-table-column label="操作" prop="a" >
            <template #default="{ row }">
               <el-button type="primary" size="small" @click="jumpEmdata(row)">修改</el-button>
               <!-- <el-button type="danger" size="small">删除</el-button> -->
               <el-popconfirm title="确认删除此员工吗？" confirm-button-text="确定" cancel-button-text="取消"
                   @confirm="del(row.id)">
                   <template #reference>
                       <el-button type="danger" size="small">删除</el-button>
                   </template>
               </el-popconfirm>
               <el-button type="success" size="small" @click="opendialog(row)">分配工单</el-button>
               <el-button type="warning" size="small" @click="good(row)">添加奖惩</el-button>
                    </template>
                </el-table-column>
      </el-table>
</div>
    <emd v-else
    @onCancel="condition = 0"
    :data="emdataList"
    @updataok="updataok"
    />

  <!-- 分配工单弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title=" '给'+dialogtitle+'分配工单' "
      width="50%"

    >
    <!-- 工单表格 -->
      <el-table :data="worktable" border style="width: 100%">
      <el-table-column prop="remarks" label="指标" >
          <template #default="{ row }">
              <el-input v-model="row.remarks"></el-input>
          </template>
        </el-table-column>
      <el-table-column prop="targetFraction" label="目标"  >
                <template #default="{ row }">
                <el-input v-model="row.targetFraction"></el-input>
            </template>
          </el-table-column>
      <el-table-column prop="address" label="操作" width="150">
              <template #default="{ row }">
                         <el-icon size="20" @click="addWorkBtn(row)"><Check /></el-icon>
                  &nbsp;
                  <el-icon size="20" @click="delWorkBtn(1)"><Delete /></el-icon>
              </template>
            </el-table-column>
      
    </el-table>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="subwork()">
            确认分配
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 奖惩弹框 -->
      <el-dialog
      v-model="god"
      title="添加奖惩"
      width="30%"

    >
          <el-input v-model="why" placeholder="请输入原因" />
      <el-input v-model="money" placeholder="请输入金额" style="margin-top: 10px;" />
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="AddgoodData()">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { Getemployee, Addwork, Addgood , Delemployee } from '../../../servers/index'
import { ElMessage } from 'element-plus'//弹出框
import emd from '../../../components/employeeData/emd.vue'
const condition = ref<number>(0)
let params: any = reactive({ pageNum: 1, pageSize: 2 })
let totalPage: any = ref(1)
let dataList: any = ref([])
let emdataList:any=ref()
const dialogVisible:any=ref(false)
const god = ref(false)
let dialogtitle:any=ref('')
let rowid:any=ref('')
let emptyrow:any=ref('')
let why:any=ref('')
let money:any=ref('')
onMounted(() => {
    getemployeedata()
})
const getemployeedata = () => {
    Getemployee(params).then((res: any) => {
        if (res.meta.code == 200) {
            console.log(res)
            totalPage.value = res.pages.total
            dataList.value = res.data
        }
    })
}

const jumpEmdata=(row:any)=>{
    condition.value=1
    emdataList.value=row
   
}
const updataok=()=>{
      condition.value = 0
      getemployeedata()
}
//分配工单
const opendialog=(row:any)=>{

    rowid.value=row.id
    dialogVisible.value=true
    console.log(row.name)
    dialogtitle.value=row.name
}
const worktable:any=reactive([{
    remarks:'',
    targetFraction:''
}])

//添加表格
const addWorkBtn=(row:any)=>{
  console.log(row)
    for(let k in row){
        if(row[k]==''){
            ElMessage.warning("请填写完整")
            return
        }
    }
    worktable.push({
        remarks:'',
        targetFraction:''
    })
}
//删除表格
const delWorkBtn=(index:any)=>{
  // console.log(index)
    if(worktable.length==1){
       ElMessage.warning("至少一条")
    }else{
    worktable.splice(index, 1)
    }
}
//确认分配
const subwork=()=>{
      let params:any={
        empId:rowid.value,
        assessmentDetail: JSON.stringify(worktable)
      }
      console.log(params)
      Addwork(params).then((res:any)=>{
            if(res.meta.code==200){
                ElMessage.success(res.meta.msg)
            }
            // console.log(res)
      })


      dialogVisible.value = false
    
}

// 奖惩部分
const good=(row:any)=>{
    god.value=true
    rowid.value=row.id

}
// 确认奖惩
const AddgoodData=()=>{
    let params:any={
        empId:rowid.value,
        money:money.value,
        reason: why.value
    }
    console.log(params)
    Addgood(params).then((res:any)=>{
            if(res.meta.code==200){
                ElMessage.success(res.meta.msg)
                 god.value = false
            }
    })
}
//删除
const del=(id:number)=>{
    let params:any={
        id
    }
    Delemployee(params).then((res:any)=>{
            if(res.meta.code==200){
              ElMessage.success(res.meta.msg)
                getemployeedata()
            }
    })
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
    bottom: 70px;
    }
    .fold{
        width: 100%;
        border: 1px solid #e4e7ed;
        padding:20px;
        //边框阴影
        box-shadow: 0 0 5px 5px rgb(0 0 0 / 10%);
    }
</style>