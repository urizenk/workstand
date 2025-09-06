<template>
  <div class="">
    <el-card>
      <div slot="header" class="clearfix">
        <span>系统日志</span>
        <el-button type="primary" class="fr" size="mini" icon="Plus">
          添加银行卡
        </el-button>
      </div>
      <el-table :data="sysLogs" border align="center" style="width: 100%">
        <el-table-column
          label="序号"
          width="60"
          align="center"
          type="index"
        ></el-table-column>
        <el-table-column
          prop="id"
          label="操作者id"
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="group"
          label="操作组"
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="method"
          label="查询方法"
          align="center"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="params"
          label="查询参数"
          align="center"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="time"
          label="耗费时间"
          align="center"
          width="20"
        ></el-table-column>
        <el-table-column
          prop="ip"
          label="客户端IP"
          align="center"
        ></el-table-column>
      </el-table>
    </el-card>
    <!-- 写一个分页器 -->
    <el-pagination
      v-model:page-size="pageSize"
      v-model:current-page="currentPage"
      :page-sizes="[3, 5, 7, 9]"
      hide-on-single-page
      background
      layout="prev, pager, next, jumper, ->,sizes ,total"
      :total="total"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs, onMounted } from 'vue'
import { reqSysLog } from '@/api/sys/index'
let sysLogs = ref([])
let total = ref(1)
onMounted(async () => {
  const res = await reqSysLog()
  sysLogs.value = res.data.records
  total.value = res.data.total
})
</script>
<style scoped lang="scss"></style>
