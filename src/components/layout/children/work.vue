<template>
    <div class="title">
        <el-icon size="20px">
            <Grid />
        </el-icon>
        <div class="wenz">
            <span>工单查询</span>
        </div>

    </div>
    <el-divider style="margin-top: 10px;" />
    <!-- 表单 -->
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="员工姓名">
            <el-input v-model="formInline.name" clearable />
        </el-form-item>
        <el-form-item label="身份证">
            <el-input v-model="formInline.idCard" clearable />
        </el-form-item>
        <el-form-item label="部门">
            <el-input v-model="formInline.depart" clearable />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button type="default" @click="retSubmit">重置</el-button>
        </el-form-item>
    </el-form>
    <!-- biaoge -->
    <div style="margin-top: 10px;">

        <el-table :data="dataList" border style="width: 100%">
            <el-table-column prop="name" label="员工姓名" width="150" />
            <el-table-column prop="idCard" label="身份证" width="150" />
            <el-table-column prop="depName" label="部门" />
            <el-table-column prop="fraction" label="得分" />
            <el-table-column prop="address" label="操作">
                <template #default="{ row }">
                    <el-button type="primary" size="small" @click="showdata(row.id)">查看详情</el-button>
                    <!-- <el-button type="danger" size="small">删除</el-button> -->
                    <el-popconfirm title="确认删除此条工单吗？" confirm-button-text="确定" cancel-button-text="取消"
                        @confirm="del(row.id)">
                        <template #reference>
                            <el-button type="danger" size="small">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>

        </el-table>
    </div>
        <!-- 分页器 -->
        <el-pagination class="pages" background layout="prev, pager, next" :total="totalPage * 5" @current-change="page" />
         <!-- 分配工单弹窗 -->
        <el-dialog
          v-model="dialogVisible"
          title='工单详情'
          width="50%"

        >
        <el-button type="primary" @click="change">修改</el-button>
        <!-- 工单表格 -->
          <el-table :data="worktable" border style="width: 100%">
          <el-table-column prop="remarks" label="指标" >

            </el-table-column>
          <el-table-column prop="targetFraction" label="目标"  >

              </el-table-column>
                        <el-table-column prop="actualFraction" label="得分"  >
                    <template #default="{ row }" >
                    <el-input v-model="row.actualFraction" v-if="changetorf"></el-input>
                </template>
                  </el-table-column>

        </el-table>

          <template #footer>
            <span class="dialog-footer" v-if="changetorf">
              <el-button @click="cancel()">取消</el-button>
              <el-button type="primary" @click="subdetails()">
                确认
              </el-button>
            </span>
          </template>
        </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { Getassessment, GetassessmentDetail, Changeassessment, Delework } from '../../../servers/index'
import { ElMessage } from 'element-plus'//弹出框
import { isDate } from 'element-plus/es/utils';
let dataList: any = ref([])
let params: any = reactive({ pageNum: 1, pageSize: 2 })
let totalPage: any = ref(1)
let changetorf: any = ref(false)
const dialogVisible: any = ref(false)
let ids:any=ref('')
onMounted(() => {
    getassessmentdata(params)
})
const getassessmentdata = (params) => {
    Getassessment(params).then((res: any) => {
        if (res.meta.code == 200) {
            console.log(res)
            totalPage.value = res.pages.total
            dataList.value = res.data
        }
    })
}
//分页
const page = (val: number) => {
        let params: any = reactive({
        ...formInline,
        pageNum: val,
        pageSize: 2
    })

    getassessmentdata(params)
}
const formInline = reactive({
    name: '',
    idCard: '',
    depart: '',
})

const onSubmit = () => {
    let params:any=reactive({
        ...formInline,
        pageNum: 1,
        pageSize: 2
    })
    console.log(params)
    getassessmentdata(params)
}
const retSubmit=()=>{
    formInline.depart='',
    formInline.name='',
    formInline.idCard=''
    getassessmentdata(params)
}

const worktable: any = ref()

const showdata=(id)=>{
    ids.value=id
    dialogVisible.value=true
    GetassessmentDetail({id}).then((res:any)=>{
        console.log(res)
        console.log(res.data.details)
        worktable.value=res.data.details
    })

}
//点击修改
const change=()=>{
    changetorf.value = true;
}
//关闭弹窗
const cancel=()=>{
    dialogVisible.value=false,
    changetorf.value=false
}
//提交修改
const subdetails=()=>{
    console.log(ids.value)
    console.log(worktable.value)
     const detailArr=ref([
        {

            actualFraction: worktable.value[0].actualFraction,
            detailId: worktable.value[0].id
        }
    ])
    let paramsem:any=reactive({
        id:ids.value,
       detailArr: JSON.stringify(detailArr.value)
    })
    Changeassessment(paramsem).then((res:any)=>{
            if(res.meta.code==200){
                ElMessage.success(res.meta.msg)
                    dialogVisible.value = false,
                changetorf.value = false
                getassessmentdata(params)
            }
    })

}
//删除
const del=(id:any)=>{
    Delework({id}).then((res:any)=>{
        if(res.meta.code==200){
            ElMessage.success(res.meta.msg)
            getassessmentdata(params)
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
</style>