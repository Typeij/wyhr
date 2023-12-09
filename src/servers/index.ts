// 集中管理接口
// ---user---
import http from "../utils/http";
export const Login = (params: any) => http.post("/users/login", params)
//获取用户列表
export const Getuser = (params: any) => http.get("/users/query", params )
//添加用户列表
export const AddUser = (params: any) => http.post("/users/save", params)
//修改密码
export const ChangPasswordInterface = (params: any) => http.post("/users/updatePassWord", params)
//查询所有角色
export const Serrole = () => http.get("/role/queryAll")
//分配角色
export const Allocationrole = (params: any) => http.post("/userRole/setRole", params)
//根据用户id查询所属权限
export const UserIdpower = (params: any) => http.get("/users/powerByUserId", params)
//删除账号
export const DelUser = (params: any) => http.get("/users/remove", params)

// ------------------------------------------------------------
// ---role---
//获取角色列表
export const Getrole = (params: any) => http.get("/role/query", params)
//添加角色
export const Addrole = (params: any) => http.post("/role/save", params)
//修改角色 
export const Changerole = (params: any) => http.post("/role/update", params)
//分配权限
export const PowerByRoleId = (params: any) => http.get("/role/queryPowerByRoleId", params)
//根据id获取权限
export const GetPower = (params: any) => http.get("users/powerByUserId", params)// 查用户的权限
//确认分配权限
export const Setrolepower = (params: any) => http.post("/powerRole/setPowerRole", params)
//删除角色
export const Delrole = (params: any) => http.get("/role/remove", params)  
// ------------------------------------------------------------
// ---power---
//查询所有权限
export const GetAllpower = () => http.get("/power/query")

// ------------------------------------------------------------
// ---depart---
//查询权限带分页
export const GetDepart = (params: any) => http.get("/department/query", params) 
//添加部门
export const AddDpart = (params: any) => http.post("/department/save", params)
//修改部门
export const ChangeDpart = (params: any) => http.post("/department/update", params)
//删除部门
export const DelDpart = (params: any) => http.get("/department/remove", params) 

// ------------------------------------------------------------
// ---position---
//查询职位带分页
export const Getposition = (params: any) => http.get("/position/query", params) 
//添加职位
export const Addposition = (params: any) => http.post("/position/save", params)
//修改职位
export const Changeposition = (params: any) => http.post("/position/update", params)
//删除职位
export const Delposition = (params: any) => http.get("/position/remove", params) 
// ------------------------------------------------------------
// ---employee---
//查询员工带分页
export const Getemployee = (params: any) => http.get("/employee/query", params)

// ------------------------------------------------------------
// ---emp---
//查询部门
export const GetdepartmentAll = () => http.get("/department/queryAll") 
//查询职位
export const GetpositionAll = () => http.get("/position/queryAll") 
//修改
export const ChangeEmployee = (params: any) => http.post("/employee/update", params)
//添加
export const AddEmployee = (params: any) => http.post("/employee/save", params)
//添加工单
export const Addwork = (params: any) => http.post("/assessment/save", params)
//添加奖惩
export const Addgood = (params: any) => http.post("/rewardPunish/save", params)
//删除员工
export const Delemployee = (params: any) => http.get("/employee/remove", params) 

// ------------------------------------------------------------
// ---work---
//查询工单
export const Getassessment = (params: any) => http.get("/assessment/query", params) 
//查询工单详情
export const GetassessmentDetail = (params: any) => http.get("/assessment/queryDetail", params) 
//修改
export const Changeassessment = (params: any) => http.post("/assessment/update", params)
//删除工单
    export const Delework = (params: any) => http.get("/assessment/remove", params)
// ------------------------------------------------------------
// ---assesst---
//考核查询
export const SerassessmenCount = (params: any) => http.get("/assessmenCount/query", params) 
//修改考核数据
export const Changeassesst = (params: any) => http.post("/assessmenCount/update", params)
//添加数据
export const Addassesst = (params: any) => http.post("/assessmenCount/save", params)
//删除数据
export const Delassesst = (params: any) => http.get("/assessmenCount/remove", params)


//奖惩查询
export const SerrewardPunish = (params: any) => http.get("/rewardPunish/query", params) 
//修改
export const ChangerewardPunish = (params: any) => http.post("/rewardPunish/update", params)
//删除奖惩
export const DelrewardPunish = (params: any) => http.get("/rewardPunish/remove", params)


//培训查询
export const Sertrain = (params: any) => http.get("/train/query", params)
//查询所有员工
export const SerqueryAll = () => http.get("/employee/queryAll")
//添加
export const addtrain = (params: any) => http.post("/train/save", params)
//修改
export const Changetrain = (params: any) => http.post("/train/update", params)
//删除
export const Deltrain = (params: any) => http.get("/train/remove", params)


//删除
export const Serpayment = (params: any) => http.get("/payment/payinfo", params)

//控制
export const Showrecord = () => http.get("/record/data")

