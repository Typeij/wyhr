<template>
      <div class="title">
        <el-icon size="20px">
          <Grid />
        </el-icon>
        <div class="wenz">
          <span>培训列表</span>
        </div>
        <el-button type="primary" @click="optan">
          <el-icon style="margin-top: 1px;">
            <Plus />
          </el-icon>
          <span>添加培训</span>

        </el-button>
      </div>
      <el-divider style="margin-top: 10px;" />
      <!-- 列表 -->
        <el-card class="box-card" v-for="item in dataList" :key="item.id" style="margin-top: 20px;">
        <template #header>
          <div class="card-header">
            <span>{{  item.theme }}</span>
                            <div>
                      <div v-if="dateTime(item.createDate)">
                          <el-button class="button"  type="primary" @click="changeBtn(item)">修改</el-button>
                    
                          <el-popconfirm title="确认删除此条培训吗？" @confirm="del(item.id)">
                          <template #reference>
                              <el-button type="danger">删除</el-button>
                          </template>
                          </el-popconfirm>
                      </div>

                      <div v-else>
                          <el-tag type="success">
                              已培训
                          </el-tag>
                      </div>
                  </div>
          </div>
        </template>
     <el-descriptions>
        <el-descriptions-item label="培训主题:" width="500px">{{ item.theme }}</el-descriptions-item>
        <el-descriptions-item label="描述:" width="500px">{{ item.remarks }}</el-descriptions-item>
        <el-descriptions-item label="地点:">{{ item.place }}</el-descriptions-item>
        <el-descriptions-item label="时间:">{{ item.createDate}}</el-descriptions-item>
        <el-descriptions-item label="参会:">{{ findem(item.empIds) }}</el-descriptions-item>
        <el-descriptions-item label="时长:">{{ item.duration }}</el-descriptions-item>
      </el-descriptions>
      </el-card>
      <!-- 添加培训弹框 -->
            <el-dialog v-model="open" :title="changeData?'修改培训':'添加培训'" width="50%">
          <!-- 内容 -->
   <el-form
      label-position="left"
      label-width="60px"
      :model="recordForm"
      style=""
    >
      <el-form-item label="主题">
        <el-input v-model="recordForm.theme" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="recordForm.remarks" />
      </el-form-item>
      <el-form-item label="时间">
          <el-date-picker
          v-model="recordForm.createDate"
          style="width:100%"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择日期"
        />
      </el-form-item>
      <el-form-item label="地点">
        <el-input v-model="recordForm.place" />
      </el-form-item>
      <el-form-item label="时长">
        <el-input-number :step="0.5" style="width:100%" :min="0" v-model="recordForm.duration" />
      </el-form-item>
    </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button type="primary" @click="changeData? changelist(): changeopen()">
                确定
              </el-button>
            </span>
          </template>
          <el-transfer :titles="['备选员工', '参会员工']" v-model="value" :data="empData" />
        </el-dialog>
        <!-- 分页器 -->
      <el-pagination class="pages" background layout="prev, pager, next" :total="totalPage * 5" @current-change="page" />
        
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { Sertrain, SerqueryAll, addtrain, Changetrain , Deltrain } from '../../../servers/index'
import { ElMessage } from 'element-plus'//弹出框
let dataList: any = ref([])
let totalPage: any = ref(1)
let epdata:any=ref([])
const open = ref(false)
const empData = ref<Option[]>([])// 穿梭框数据
const value = ref([])
let changeData=ref(false)
let params: any = reactive({ pageNum: 1, pageSize: 2 })
onMounted(() => {
    gettraindata()
    getem()
})
const gettraindata = () => {

    Sertrain(params).then((res: any) => {
        if (res.meta.code == 200) {
            console.log(res)
            totalPage.value = res.pages.total
            dataList.value = res.data
        }
    })
}

const getem = () => {
    SerqueryAll().then((res: any) => {
        if (res.meta.code == 200) {
            epdata.value=res.data
            console.log(epdata)
            empData.value= generateData()
        }
    })
}
//分页
const page = (val: number) => {
  // console.log(`current page: ${val}`)
  params.pageNum = val
   gettraindata()
}
const findem = (ids:any) => {
    let empids = ids
    console.log(empids);
    let empname = epdata.value
        .filter((item:any) => empids.includes(item.id))
        .map((item:any) => item.name);

    console.log(empname);
    let str=empname.join(",")
    return str;
}
const recordForm = ref<any>({
  theme: '',
  remarks: '',
  duration: '',
  createDate: '',
  place: ''
})

interface Option {
  key: number
  label: string
  disabled: boolean
}

const generateData = () => {// 创建穿梭框对应字段
  const data: Option[] = []
  epdata.value.map((item: any) => {
    data.push({
      key: item.id,
      label: item.name,
      disabled: false
    })
  })
  return data
}
//循环置空
const clearRecordForm = () => {
  Object.keys(recordForm.value).forEach(key => {
    if (key !== 'duration') {
      recordForm.value[key] = ''
    } else {
      recordForm.value[key] = 0
    }
  })
}

const optan=()=>{
  changeData.value = false
  open.value=true
  clearRecordForm()
  value.value=[]
}

const changeopen=()=>{
  console.log(recordForm.value)
  console.log(value.value)
    
  // console.log(valueArray)
 const valueArray = Object.values(value.value)
  let params = {
    theme: recordForm.value.theme,
    remarks: recordForm.value.remarks,
    duration: recordForm.value.duration,
    createDate: recordForm.value.createDate,
    place: recordForm.value.place,
    empIds: JSON.stringify(valueArray)
  }
  //  console.log(params)
   addtrain(params).then((res:any)=>{
        if(res.meta.code==200){
          ElMessage.success(res.meta.msg)
          open.value=false
          gettraindata()
        }
   })
}
const dateTime = (time: any) => {// 计算培训的日期是否过期
  let now_time = new Date().getTime()
  let to_time = new Date(time).getTime()
  return to_time > now_time
}

//修改
let rowid: any = ref('')
  const changeBtn=(row:any)=>{
        console.log(row)
        rowid.value=row.id
        changeData.value=true
        open.value=true
        recordForm.value=row
        value.value=row.empIds
    //  console.log(recordForm.value)

  }
  //确认修改
  const changelist=()=>{
    console.log(11111)
    const valueArray = value.value
  let params = {
    theme: recordForm.value.theme,
    remarks: recordForm.value.remarks,
    duration: recordForm.value.duration,
    createDate: recordForm.value.createDate,
    place: recordForm.value.place,
    empIds: valueArray,
    id:rowid.value
  }
    // console.log(params)
    // console.log(rowid.value)
    
  Changetrain(params).then((res:any)=>{
        if(res.meta.code==200){
          ElMessage.success(res.meta.msg)
          gettraindata()
          open.value=false
        }
  })
  }
  //删除
  const del=(id:number)=>{
    Deltrain({id}).then((res:any)=>{
        if(res.meta.code==200){
          ElMessage.success(res.meta.msg)
          gettraindata()
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


.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}



</style>