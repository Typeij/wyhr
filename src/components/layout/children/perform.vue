<template>
        <div class="title">
            <el-icon size="20px">
                <Grid />
            </el-icon>
            <div class="wenz">
                <span>查询奖惩</span>
            </div>
        </div>
            <el-divider style="margin-top: 10px;" />
        <!-- 表单 -->
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="员工姓名">
                <el-input v-model="formInline.name" clearable />
            </el-form-item>
    <el-form-item label="奖惩">
          <el-select
            v-model="formInline.status"
            clearable
          >
            <el-option label="奖励" value="1" />
            <el-option label="惩罚" value="2" />
          </el-select>
        </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
        </el-form>
            <!-- biaoge -->
        <div style="margin-top: 10px;">

            <el-table :data="dataList" border style="width: 100%">
                <el-table-column prop="name" label="员工姓名" width="150" />
                <el-table-column prop="reason" label="理由" width="150" />
                <el-table-column prop="money" label="金额" />
                <el-table-column prop="status" label="状态" >
                    <template #default="{ row }">
                        {{ row.status == 1 ? '奖励' : '惩罚'}}
                    </template>
                        </el-table-column>
                <el-table-column prop="address" label="操作">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" @click="showdata(row.id,row.reason)">修改</el-button>
                        <!-- <el-button type="danger" size="small">删除</el-button> -->
                        <el-popconfirm title="确认删除吗？" confirm-button-text="确定" cancel-button-text="取消"
                            @confirm="del(row.id)">
                            <template #reference>
                                <el-button type="danger" size="small">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>

            </el-table>
        </div>
        <!-- 点击修改弹窗 -->
            <el-dialog v-model="open" title="请修改理由" width="30%">
            <!-- 内容 -->

            <el-input v-model="inputrole" placeholder="请输入理由" />

            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="changeopen()">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>

            <!-- 分页组件 -->
        <el-pagination class="pages" background layout="prev, pager, next" :total="totalPage * 5" @current-change="page" />
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { SerrewardPunish, ChangerewardPunish, DelrewardPunish } from '../../../servers/index'
import { ElMessage } from 'element-plus'//弹出框
let dataList: any = ref([])
let params: any = reactive({ pageNum: 1, pageSize: 2 })
let totalPage: any = ref(1)
let inputrole:any=ref('')
let rowid:any=ref('')
const open = ref(false)
onMounted(() => {
    getrewardPunishdata(params)
})
const getrewardPunishdata = (params:any) => {
    SerrewardPunish(params).then((res: any) => {
        if (res.meta.code == 200) {
            console.log(res)
            totalPage.value = res.pages.total
            dataList.value = res.data
        }
    })
}


const formInline = reactive({
    name: '',
    status:''
})

const onSubmit = () => {
    let params: any = reactive({
        ...formInline,
        pageNum: 1,
        pageSize: 2
    })
    console.log(params)
    getrewardPunishdata(params)
}
// 点击弹出
const showdata=(id:any, reason:any)=>{
    open.value=true
    rowid.value=id
    inputrole.value=reason
}
//确定修改
const changeopen=()=>{
    let paramsdata:any={
        id:rowid.value,
        reason:inputrole.value
    }
    let twoparams:any={
        ...formInline,
        ...params
    }
    console.log(paramsdata)
    ChangerewardPunish(paramsdata).then((res:any)=>{
        if(res.meta.code==200){
            ElMessage.success(res.meta.msg)
            open.value=false
                getrewardPunishdata(twoparams)
        }
    })
}
//确认删除
const del=(id:any)=>{
        let twoparams: any = {
        ...formInline,
        ...params
    }
    DelrewardPunish({id}).then((res:any)=>{
        if(res.meta.code==200){
            ElMessage.success(res.meta.msg)
            getrewardPunishdata(twoparams)
        }
    })
}
// 分页逻辑
const page = (val: number) => {
    let params: any = reactive({
        ...formInline,
        pageNum: val,
        pageSize: 2
    })
    params.pageNum = val
     getrewardPunishdata(params)
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