<template>
      <div class="title">
        <el-icon size="20px">
          <Grid />
        </el-icon>
        <div class="wenz">
          <span>部门列表</span>
        </div>
        <el-button type="primary" @click="openone()">
          <el-icon style="margin-top: 1px;">
            <Plus />
          </el-icon>
          <span>添加部门</span>

        </el-button>
      </div>
      <!-- biaoge -->
        <div style="margin-top: 10px;">

        <el-table :data="dataList" border style="width: 100%">
          <el-table-column prop="id" label="id" width="150" />
          <el-table-column prop="depName" label="部门名称" width="150" />
          <el-table-column prop="remarks" label="描述" />
          <el-table-column prop="remarks" label="等级" >
                         <template #default="{ row }">
                        <el-tag :type="row.level == 1 ? 'success' : ''" >
                          {{ row.level == 1 ? '一级部门' : '二级部门' }}
                        </el-tag>
                      </template>
          </el-table-column>
          <el-table-column prop="address" label="操作">
            <template #default="{ row }">
              <el-button type="primary" size="small" @click="change(row.id, row.depName, row.remarks)">修改</el-button>
              <!-- <el-button type="danger" size="small">删除</el-button> -->
                         <el-popconfirm title="确认删除此部门吗？"
              confirm-button-text="确定"
            cancel-button-text="取消"
            @confirm="del(row.id)"
            >
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

          <!-- 点击添加角色弹出框 -->
      <!-- {{ tankuang }} -->
      <el-dialog v-model="open" :title="tankuang ? '添加部门' : '修改部门'" width="30%">
        <!-- 内容 -->

        <el-input v-model="inputrole" placeholder="请输入部门" />
        <el-input v-model="inputDescribe" placeholder="请输入描述" style="margin-top: 10px;" />

        <!-- <span>This is a message</span> -->
        <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="tankuang ? opens() : changeopen()">
              确定
            </el-button>
          </span>
        </template>
      </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { GetDepart, AddDpart, ChangeDpart, DelDpart } from '../../../servers/index'
import { ElMessage } from 'element-plus'//弹出框

let partId:any=ref('')
let inputrole:any=ref('')
let inputDescribe:any=ref('')
let tankuang: any = ref('')
let totalPage: any = ref(1)
let dataList:any=ref([])
let params: any = reactive({ pageNum: 1, pageSize: 2 })
onMounted(()=>{
    getdepartdata()
})
const getdepartdata=()=>{
    GetDepart(params).then((res:any)=>{
        if(res.meta.code==200){
            console.log(res)
              totalPage.value = res.pages.total
            dataList.value=res.data
        }
    })
}
//分页
const page = (val: number) => {
    // console.log(`current page: ${val}`)
    params.pageNum = val
    getdepartdata()
}
// 添加部门部分
const open = ref(false)
const openone = () => {
    inputDescribe.value = ''
    inputrole.value = ''
    tankuang.value = true
    open.value = true

}
const opens = () => {
    console.log(123123)
    let params: any = reactive({
        depName: inputrole.value,
        remarks: inputDescribe.value
    })
    // 请求接口
    AddDpart(params).then((res: any) => {
        if (res.meta.code == 200) {
            ElMessage.success('添加成功')
            open.value = false
            getdepartdata()
        }
    })
}
//修改部门
const change = (id: number, name: any, rem: any) => {
    tankuang.value = false
    open.value = true
    partId.value = id
    inputrole.value = name
    inputDescribe.value = rem
}
//修改接口
const changeopen = () => {
    let params: any = reactive({ id: partId.value, depName: inputrole.value, remarks: inputDescribe.value })
    console.log(params)
    console.log(partId.value)
    ChangeDpart(params).then((res: any) => {
        if (res.meta.code == 200) {
            ElMessage.success('修改成功')
            open.value = false
            getdepartdata()
        }
    })
}
//删除部门
const del=(id:number)=>{
    let params:any=reactive({id:id})
    DelDpart(params).then((res:any)=>{
        if(res.meta.code==200){
            ElMessage.success('删除成功')
            getdepartdata()
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