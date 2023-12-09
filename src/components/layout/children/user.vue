<template>
  <div class="title">
    <el-icon size="20px">
      <Grid />
    </el-icon>
    <div class="wenz">
      <span>用户列表</span>
    </div>
    <el-button type="primary" @click="open = true">
      <el-icon style="margin-top: 1px;">
        <Plus />
      </el-icon>
      <span>添加用户</span>

    </el-button>
  </div>
  <!-- 表格部分 -->
  <div style="margin-top: 10px;">

    <el-table :data="dataList" border style="width: 100%">
      <el-table-column prop="id" label="id" width="150" />
      <el-table-column prop="userName" label="账号" width="150" />
      <el-table-column prop="passWord" label="密码">
        <!-- 插槽是否显示密码 -->
        <template #default="{ row }">
          {{ row.value ? row.passWord : '******' }}
        </template>
      </el-table-column>
      <el-table-column prop="showPassword" label="查看密码">
        <template #default="{ row }">
          <el-switch v-model="row.value" />
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template #default="{ row }">
          <el-button type="warning" size="small" @click="changePws(row.passWord,pwid=row.id)">修改密码</el-button>
          <el-button type="primary" size="small" @click="showpower(row.id)">查看权限</el-button>
  
            <span style="display: inline-block; width: 10px;"></span>
           <el-dropdown trigger="click">
          <el-button type="success" size="small" style="margin-top: 1px;">分配角色</el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="item in Allrole" :key="item.id" @click="roleclick(item.id,row.id)">{{ item.roleName }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
  <span style="display: inline-block; width: 10px;"></span>
       
          <!-- <el-button type="danger" size="small" @click="del(row.id)">删除</el-button> -->
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
  <!-- 分页组件 -->
  <el-pagination class="pages" background layout="prev, pager, next" :total="totalPage * 5" @current-change="page" />
  <!-- 点击添加用户弹出框 -->
  <el-dialog v-model="open" title="添加用户" width="30%">
    <!-- 内容 -->

    <el-input v-model="usercount" placeholder="请输入账号" />
    <el-input v-model="userPw" placeholder="请输入密码" style="margin-top: 10px;" />

    <!-- <span>This is a message</span> -->
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="opens()">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 点击修改密码 -->
    <el-dialog
      v-model="changePw"
      title="请修改密码"
      width="30%"
    >
  <el-input v-model="changePassword" placeholder="请输入密码" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="changePw = false">取消</el-button>
          <el-button type="primary" @click="changePasswordTwo()">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!--点击查看权限弹框  -->
    <el-dialog
      v-model="showpowers"
      title="查看权限"
      width="80%"
      style="height: 600px; margin-top: 50px;"
  
    >
    <!-- 数据 -->
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
      <template #footer>
        <span class="dialog-footer">

        </span>
      </template>
    </el-dialog>


</template>

<script lang="ts" setup>

import { onMounted, reactive, ref } from 'vue'
import { Getuser, AddUser, ChangPasswordInterface, Serrole, Allocationrole, UserIdpower,DelUser } from '../../../servers/index'
import { ElMessage } from 'element-plus'//弹出框
import {dataTree} from '../../../utils/datatree'
const usercount = ref('')//添加用户的账号
const userPw = ref('')//添加用户的密码
const changePassword=ref('')//修改密码
const pwid=ref('')
const powerDataList=ref<any[]>([])
let params: any = reactive({ pageNum: 1, pageSize: 2 })
let dataList: any = ref([])
let totalPage: any = ref(1)
let Allrole:any=ref([]) //所有角色
const GetuserDate = async () => {
  let res: any = await Getuser(params)
  console.log(res)
  dataList.value = res.data
  totalPage.value = res.pages.total
  console.log(totalPage.value)
  // console.log(dataList)
}

onMounted(() => {

  GetuserDate()
  role() //获取所有角色
})
// 分页逻辑
const page = (val: number) => {
  // console.log(`current page: ${val}`)
  params.pageNum = val
  GetuserDate()
}
//添加用户实现

// 点击用户弹出框
const open = ref(false)
const opens = () => {
  open.value = false
  let Userparams: any = reactive({ userName: usercount.value, passWord: userPw.value })
  // 调用AddUser
  const addU = async () => {
    let res: any = await AddUser(Userparams)
    if (res.meta.code == 200) {
      ElMessage({
        message: res.meta.msg,
        type: 'success'
      })
    }
    // 清空input
    usercount.value = ''
    userPw.value = ''
    GetuserDate()
  }
  addU()
}
//点击修改密码
const changePw = ref(false)
const changePws=(data: any,id:any)=>{
  console.log(id)
  changePw.value=true
  console.log(data)

  changePassword.value=data
}
  const changePasswordTwo=()=>{
  changePw.value = false
  // 调用修改密码接口
  let params: any = reactive({id: pwid.value , passWord : changePassword.value})
    if(params.passWord.length==0){
      ElMessage({
        message: '密码不能为空',
        type: 'error'
      })
      changePw.value=true
    }else{
    ChangPasswordInterface(params).then((res:any) => {
      if(res.meta.code==200){
        ElMessage({
          message: res.meta.msg,
          type: 'success'
        })
      }
    })
      GetuserDate()
    }

}
//分配角色
const role= async ()=>{
  let res:any= await Serrole()
    console.log(res)
    Allrole.value=res.data[0]
    // const roleNames = Allrole.value.map((role: any) => role.roleName);
    const roleNamesWithId = Allrole.value.map((role: any) => ({ id: role.id, roleName: role.roleName }));
    Allrole.value= roleNamesWithId
      console.log(Allrole.value);
}
//分配角色调接口
const roleclick=(id:number,userId:number)=>{
  console.log(id)
  let params:any={roleId:id,userId:userId}
  Allocationrole(params).then((res:any)=>{
      if(res.meta.code==200){
        ElMessage({
          message: res.meta.msg,
          type: 'success'
        })
      }
  })
}
//查看权限
const showpowers = ref(false)
const showpower=(id:number)=>{
  showpowers.value=true
  console.log(id)
  let params:any={userId:id}
  UserIdpower(params).then((res:any)=>{
    console.log(res.data)
    powerDataList.value=dataTree(res.data)
    console.log(powerDataList.value)
  })
}
// 删除用户数据
const del=(id:number)=>{
  console.log(id)
  //调用删除接口
  let params:any={id:id}
  DelUser(params).then((res:any)=>{
      if(res.meta.code==200){
        ElMessage({
          message:res.meta.msg,
          type:'success'
        })
      }
  })
  GetuserDate()
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