<template>
      <div class="title">
        <el-icon size="20px">
          <Grid />
        </el-icon>
        <div class="wenz">
          <span>工资条</span>
             <el-button type="primary" @click="out">导出工资条</el-button>
        </div>
        <el-input v-model="params.name" placeholder="请输入姓名">
               <template #append>
            <el-button :icon="Search" @click="search()" />
          </template>
        </el-input>
      </div>
      <!-- 表格 -->
        <el-table :data="dataList" style="width: 100%; margin-top: 20px;">
       <el-table-column type="selection" width="55" />
        <el-table-column label="基础信息">
          <el-table-column prop="code" label="编号"/>
            <el-table-column prop="name" label="姓名" />
            <el-table-column prop="dept" label="部门"  />
            <el-table-column prop="posit" label="职位" />
        </el-table-column>
          <el-table-column prop="wages_job" label="底薪"/>
          <el-table-column prop="salary" label="绩效"/>
          <el-table-column prop="allowance" label="津贴"/>
          <el-table-column prop="tax" label="个人所得税"/>
                  <el-table-column label="绩效考核">
              <el-table-column prop="days" label="出勤"/>
                <el-table-column prop="bing_week" label="病假" />
                <el-table-column prop="thing_week" label="事假"  />
                <el-table-column prop="prod_week" label="产假" />
                <el-table-column prop="nowork" label="矿工"  />
            </el-table-column>
                              <el-table-column label="扣款">
                  <el-table-column prop="cd_days" label="迟到"/>
                  <el-table-column prop="orther_days" label="其他"/>
                </el-table-column>
                                  <el-table-column label="五险一金">
                  <el-table-column prop="old_m" label="养老"/>
                    <el-table-column prop="doc_m" label="医疗" />
                    <el-table-column prop="nojob_m" label="失业"  />
                    <el-table-column prop="gs_m" label="工伤" />
                    <el-table-column prop="sy_m" label="生育"  />
                    <el-table-column prop="public_m" label="公积金"  />
                </el-table-column>
                                <el-table-column  label="实发" width="" >
                <template #default={row}>
                  <!-- {{row}} -->
                  {{ getm(row) }}
                </template>
              </el-table-column>
      </el-table>
        <!-- 分页器 -->
          <el-pagination class="pages" background layout="prev, pager, next" :total="totalPage *2" @current-change="page" />
<!-- 导出 -->

 


</template>

<script setup lang="ts">

import { onMounted, reactive, ref } from 'vue'
import { Serpayment } from '../../../servers/index'
import { ElMessage , ElMessageBox } from 'element-plus'//弹出框
import { Search } from '@element-plus/icons-vue'
import * as XLSX from 'xlsx';

let totalPage: any = ref(1)
let dataList: any = ref([])
let params: any = reactive({ pageNum: 1, pageSize: 5,name:'' })
onMounted(() => {
    getSerpayment()
})
const getSerpayment = () => {
    Serpayment(params).then((res: any) => {
        if (res.meta.code == 200) {
            console.log(res)
            totalPage.value = res.pages.total
            console.log(totalPage.value)
            dataList.value = res.data
        }
    })
}

const getm = (row: any) => (row.allowance + row.salary + row.wages_job) - (row.sy_m + row.gs_m + row.old_m + row.nojob_m + row.doc_m + row.public_m + row.cd_days + row.orther_days)


//分页
const page = (val: number) => {
    params.pageNum = val
     getSerpayment()
}
const search=()=>{

    console.log(params)
       getSerpayment() 
}

// -------------------------------

const exportList = (list:any) => {
  //表格表头,导出表头
  let tableHeader = [['#', '编号', '姓名', '部门', '职位', "底薪", "绩效",
    "津贴", "个人所得税", "出勤", "病假", "事假", "产假", "婚假", "矿工", "迟到",
     "养老", "医疗", "失业", "工伤", "生育", "公积金","实发"]]
  list.forEach((item:any, index:any) => {
    let rowData = []
    //导出内容的字段
    rowData = [
      index + 1,
      item.code,
      item.name,
      item.dept,
      item.posit,
      item.wages_job,
      item.salary,
      item.allowance,
      item.tax,
      item.days,
      item.bing_week,
      item.thing_week,
      item.prod_week,
      item.nowork,
      item.cd_days,
      item.orther_days,
      item.old_m,
      item.doc_m,
      item.nojob_m,
      item.gs_m,
      item.sy_m,
      item.public_m,
       getm(item) // 计算实发并添加到新的列中
    ]
    tableHeader.push(rowData)
  })
  let wb = XLSX.utils.book_new()
  let ws = XLSX.utils.aoa_to_sheet(tableHeader)
  XLSX.utils.book_append_sheet(wb, ws, '工资表') // 工作簿名称
  XLSX.writeFile(wb, '工资表.xlsx') // 保存的文件名
}
// --------------
/**
 * 表格数据导出Excel调用方法
 */
const exportExcel = () => {
  ElMessageBox.confirm(
          '确定导出工资信息表吗？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
  )
          .then(async () => {
            let list = [];
            const res:any = await Serpayment({ pageNum: 1, pageSize: 1000000, name: '' });
            console.log(res)
            list = res.data
            exportList(list);
            if (res.meta.code === 200) {
              ElMessage({
                type: 'success',
                message: '正在下载',
              })
            }
          })
          .catch(() => {
          })
}

const out=()=>{
    exportExcel()
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

    .el-input {
        width: 250px;
        position: absolute;
        right: 30px;
    }

}

.pages {
    position: absolute;
    bottom: 70px;
}
</style>