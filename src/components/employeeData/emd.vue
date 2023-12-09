<template>
    <div class="title">
        <el-icon size="20px">
            <ArrowLeft />
        </el-icon>
        <div class="wenz">
            <span>{{ props.data ? '修改' : '添加' }}员工</span>
        </div>
        <el-button type="primary" @click="jumpok()" style="margin-right: 70px;">
            <span>确认{{ props.data ? '修改' : '添加' }}</span>
        </el-button>
                <el-button type="default" @click="qx()">
                <span>取消</span>
            </el-button>
    </div>
    <!-- 表单 -->
        <el-card class="box-card">
            <el-form class="miaoshu" label-width="80px">
          <el-form-item :label='item' v-for="item, k in biaodanData" :key="item" style="width: 30%; margin-top: 10px;">
         <el-input v-model="biaodzd[k]" v-if="!['depID', 'positionId'].includes(k)"  class="ip"/>
                   <el-select v-model="biaodzd[k]" v-if="['depID', 'positionId'].includes(k)">
                  <el-option :label="k == 'depID' ? item.depName : item.positionName"  :key="item.id" :value="item.id" v-for="item in k == 'depID' ? depList : posList" />
              </el-select>
          </el-form-item>
            </el-form>
      </el-card>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { GetdepartmentAll, GetpositionAll, ChangeEmployee, AddEmployee } from '../../servers/index'
import { ElMessage } from 'element-plus'//弹出框
let depList:any=ref([])
let posList: any = ref([])
const emit: any = defineEmits() //自定义事件
const qx = () => {// 返回事件 传给父组件
    //  console.log(666);
    emit("onCancel")

}
const getdepartdata=()=>{
    GetdepartmentAll().then((res:any)=>{
        console.log(res)
        depList.value=res.data
    })
}
const getpositiondata = () => {
    GetpositionAll().then((res: any) => {
        console.log(res)
        posList.value = res.data
    })
}
const refrom=()=>{
    if(props.data==null){
        return
    }
    for(let k in props.data){
        biaodzd[k]=props.data[k]
    }
}
//确认修改或添加
const jumpok=()=>{
    if(props.data==null){
        //确认添加
        console.log(biaodzd)
        for(let k in biaodzd){
            if(biaodzd[k]==''){
             ElMessage.warning('请填写完整')
                return
            }    
        }
         AddEmployee(biaodzd).then((res: any) => {
            if (res.meta.code == 200) {
                ElMessage.success(res.meta.msg)
                emit("updataok")
            }
        })
    }
    const { depName, entryTime, positionName, ...rest } = biaodzd;
    console.log(biaodzd)
    //  console.log(rest)
    ChangeEmployee(rest).then((res:any)=>{
        if(res.meta.code==200){
            ElMessage.success(res.meta.msg)
             emit("updataok")
        }
         
    })
    
}



onMounted(()=>{
    getdepartdata()
    getpositiondata()
    refrom()
})
const props: any = defineProps({
    data: Object
})
const biaodanData = {
    name: "姓名",
    age: "年龄",
    sex: "性别",
    idCard: "身份证",
    NativePlace: "籍贯",
    education: "学历",
    school: "毕业院校",
    tel: "电话",
    depID: "部门",
    positionId: "职位",
    major: "业务",
    resume: "头像",
    salary: "薪酬",
    assessmentSalary: "底薪",
}
const biaodzd = reactive<any>({
    name: "",
    age: "",
    sex: "",
    idCard: "",
    NativePlace: "",
    education: "",
    school: "",
    tel: "",
    depID: "",
    positionId: "",
    major: "",
    resume: "",
    salary: "",
    assessmentSalary:""
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
.box-card{
      margin-top: 20px;
    height: 70vh;
    display: flex;
    justify-content: center;
    .miaoshu{
    
      width: 80%;
      display:flex;
      justify-content:space-around;
      align-items: center;
      flex-wrap:wrap;
      margin: 50px auto;
    }
}


</style>