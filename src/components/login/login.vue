<template>
<div class="login">
<el-card class="box-card">
<template #header>
<div class="card-header">
<span>欢迎登录万云集团HR管理系统</span>
<img style="width: 50px; height: 50px" src="../../assets/logo.png" />
</div>
</template>
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="60px"
      class="demo-ruleForm"
      status-icon
    >
      <el-form-item label="账号" prop="userName">
        <el-input v-model="form.userName" />
      </el-form-item>
      <el-form-item label="密码" prop="passWord">
        <el-input type="password" v-model="form.passWord" />
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="login(formRef)">
          登录
        </el-button>
        <!-- <el-button @click="resetForm(ruleFormRef)">重置</el-button> -->
      </el-form-item>
    </el-form>
</el-card>
</div>
</template>

<script setup lang='ts'>
import { reactive,ref} from "vue"// 引入钩子
import {useRouter} from "vue-router"// 引入路由
import type { FormInstance, FormRules } from 'element-plus'// 表单接口
import {Login} from '../../servers/index'
import {set,get} from '../../utils/local'
import {GetPower} from '../../servers/index'
import {dataTree} from "../../utils/datatree"
// import {getMenu} from '../../utils/addrouter'
const router=useRouter()// 创建路由对象
const formRef = ref<FormInstance>()// 创建表单实例组件
let dataList=ref<any[]>([])

const form=reactive({// 创建表单绑定数据

userName:'',
passWord:""
})
const rules = reactive<FormRules>({// 正则验证
userName:[{required: true, message: '请输入账号', trigger: 'blur' }],
passWord:[{required: true, message: '请输入密码', trigger: 'blur' }],
})
const login=async (formEl: FormInstance | undefined) => {// 登录
if (!formEl) return
await formEl.validate((valid, fields) => {// 进行正则验证
if (valid) {
//调用登录接口
console.log(form)
Login(form).then((res:any)=>{
        console.log(res);
    //将token存储到本地
    set('token',res.meta.token)
    set('userId',res.data.id)
    getMenu(res.data.id)
    // .then(()=>{
    // router.push("/index")
    // })


    
})
//动态路由部分
// const userId=get('userId')
// console.log(userId)
// //调用接口
console.log(666);
} else {
console.log('error submit!', fields)
}
})


  
}
const getMenu= async(userId:number)=>{
    let test={
        userId
    }
 let res:any= await  GetPower(test)
    console.log(res)
        // datas=res.data
        dataList.value=dataTree(res.data)
        console.log(dataList.value)
        //动态路由
let Menu:any[]=dataList.value;
let oldMenu=get('menu')
if(oldMenu){
    //之前有路由则删掉
    oldMenu.forEach(v=>{
        router.removeRoute(v.name)
    })
}
    Menu.forEach(item=>{
        let children=[]
                    if(item.children.length>0){
                //有二级路由
                children=item.children.map(v=>{
                    return router.addRoute('index',{
                            path:v.powerUrl,
                            name:v.powerUrl,
                            meta: {
                            list:[item.powerName,v.powerName]
                              },
                            // component:()=>import(`./layout/children/${v.powerUrl}`)
                            component:()=>import(`../layout/children/${v.powerUrl}.vue`)
                    })
                })
            }
             
    })
    set('menu',Menu)
    console.log(router.getRoutes());
    
router.push("/index/ctrl")
}





</script>

<style scoped lang="less">
.login{
width: 100vw;
height: 100vh;
background-image: url('../../assets/bg3.png');
background-repeat: no-repeat;
background-size: 100% 100%;
display: flex;
justify-content: flex-end;
align-items: center;
// padding-right: 100px;
    
.box-card{
width: 400px;
height: 300px;
margin-right:  100px;
.card-header {
display: flex;
justify-content: space-between;
align-items: center;
}
}
}
</style>

