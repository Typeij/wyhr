<template>
  <div class="title">
    <el-icon size="20px">
      <Grid />
    </el-icon>
    <div class="wenz">
      <span>角色列表</span>
    </div>
    <el-button type="primary" @click="openone()">
      <el-icon style="margin-top: 1px;">
        <Plus />
      </el-icon>
      <span>添加角色</span>

    </el-button>
  </div>
  <!-- 表格部分 -->


  <div style="margin-top: 10px;">

    <el-table :data="dataList" border style="width: 100%">
      <el-table-column prop="id" label="id" width="150" />
      <el-table-column prop="roleName" label="角色" width="150" />
      <el-table-column prop="remarks" label="描述" />
      <el-table-column prop="address" label="操作">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="change(row.id, row.roleName, row.remarks)">修改</el-button>
          <el-button type="success" size="small" @click="Power(row.id)">分配权限</el-button>
          <!-- <el-button type="danger" size="small">删除</el-button> -->
                     <el-popconfirm title="确认删除此用户吗？"
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
  <el-dialog v-model="open" :title="tankuang ? '添加角色' : '修改角色'" width="30%">
    <!-- 内容 -->

    <el-input v-model="inputrole" placeholder="请输入角色" />
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
  <!-- 分配权限弹框 -->
  <el-drawer v-model="drawer" title="分配权限" show-close direction="ltr">
    <!-- 权限树形控件 -->
    <el-tree :data="powerDataList" :props="treeProps" show-checkbox @check-change="handleCheckChange"  ref="tree"
      node-key="id"></el-tree>
    <!-- {{ defaultKeys }} -->
    <el-button type="primary" @click="setPower()">确认</el-button>
  </el-drawer>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { Getrole, Addrole, Changerole, PowerByRoleId, GetPower , Setrolepower, Delrole } from '../../../servers/index'
import { ElMessage } from 'element-plus'//弹出框
import { dataTree } from '../../../utils/datatree'
const powerDataList = ref<any[]>([])

let tankuang: any = ref('')
let roleId: any = ref(1)
let inputDescribe: any = ref('')//添加角色
let inputrole: any = ref('')//添加角色
let defaultKeys = ref<number[]>([])//默认勾选
const tree = ref()
let totalPage: any = ref(1)
let dataList: any = ref([])
let params: any = reactive({ pageNum: 1, pageSize: 2 })
const GetroleDate = async () => {
  let res: any = await Getrole(params)
  console.log(res)
  dataList.value = res.data
  totalPage.value = res.pages.total
  console.log(totalPage.value)
  // console.log(dataList)
}
const GetPw = async () => {
  let params: any = { userId: 1 }
  let res: any = await GetPower(params)
  powerDataList.value = dataTree(res.data)
  console.log(powerDataList.value)
}
onMounted(() => {
  GetroleDate()
  GetPw()
})
//权限树
const treeProps = {
  label: 'powerName',
  children: 'children'
};
interface Tree {
  name: string
}
const handleCheckChange = (
  data: Tree,
  checked: boolean,
  indeterminate: boolean
) => {
  console.log(data, checked, indeterminate)
}


// 添加角色部分
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
    roleName: inputrole.value,
    remarks: inputDescribe.value
  })
  // 请求接口
  Addrole(params).then((res: any) => {
    if (res.meta.code == 200) {
      ElMessage.success('添加成功')
      open.value = false
      GetroleDate()
    }
  })
}
// 分页逻辑
const page = (val: number) => {
  // console.log(`current page: ${val}`)
  params.pageNum = val
  GetroleDate()
}
//修改
const change = (id: number, name: any, rem: any) => {
  tankuang.value = false
  open.value = true
  roleId.value = id
  inputrole.value = name
  inputDescribe.value = rem
}
const changeopen = () => {
  let params: any = reactive({ id: roleId.value, roleName: inputrole.value, remarks: inputDescribe.value })
  console.log(params)
  console.log(roleId.value)
  Changerole(params).then((res: any) => {
    if (res.meta.code == 200) {
      ElMessage.success('修改成功')
      open.value = false
      GetroleDate()
    }
    // console.log(res)
  })
}
//分配权限
let powerid:any=ref(0)
const drawer = ref(false)
const Power = (id: number) => {
  defaultKeys = ref<number[]>([])//每次打开清空
  powerid.value=id
  drawer.value = true
  let params: any = reactive({ roleId: id })
  PowerByRoleId(params).then((res: any) => {
    if (res.meta.code == 200) {
      res.data.map((item: any) => {
        defaultKeys.value.push(item.id)
      })
      //   console.log(defaultKeys.value)
      // console.log(tree)
      tree.value.setCheckedKeys(defaultKeys.value)
      defaultKeys.value.map((item:any)=>{
        tree.value.setCurrentKey(item,true)
      })
    }
  })
}
// 确认分配权限

const setPower=()=>{
  let powerList: any = []
  let parentId: any = []
    // console.log(powerDataList) 需要将父id和子id都取出来
    powerList=tree.value!.getCheckedKeys(true)
    powerDataList.value.map((item:any)=>{
          item.children.map((it:any)=>{
              if(powerList.includes(it.id)){
                    parentId.push(it.parentId)
              }
          })
    })
    parentId=Array.from(new Set(parentId))
    // console.log(parentId)
   let powerKes=[...parentId,powerList].join(',')
  //  console.log(powerKes)

   let params:any={
       roleId:powerid.value,
      powerIds:powerKes
   }
  Setrolepower(params).then((res:any)=>{
      if(res.meta.code==200){
        drawer.value=false
        ElMessage.success(res.meta.msg)
      }
  })
}
//删除
const del=(id:number)=>{
  Delrole({id:id}).then((res:any)=>{
      if(res.meta.code==200){
        ElMessage.success(res.meta.msg)
         GetroleDate()
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