<template>
  <div class="system-dic-container">
    <el-card shadow="hover">
      <!--搜索 start-->
      <div class="system-user-search mb15">
        <el-input size="default" placeholder="请输入字典名称" style="max-width: 180px"></el-input>
        <el-button size="default" type="primary" class="ml10">
          <el-icon>
            <ele-Search/>
          </el-icon>
          查询
        </el-button>
        <el-button size="default" type="success" class="ml10">
          <el-icon>
            <ele-FolderAdd/>
          </el-icon>
          新增字典
        </el-button>
      </div>
      <!--搜索 end-->

      <!-- 表格 start-->
      <el-table :data="tableData.data" style="width: 100%">
        <el-table-column type="index" label="序号" width="50"/>
        <el-table-column prop="dicName" label="字典名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="fieldName" label="字段名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="status" label="字典状态" show-overflow-tooltip>
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.status">启用</el-tag>
            <el-tag type="info" v-else>禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="describe" label="字典描述" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button size="small" text type="primary" @click="onOpenEditDic(scope.row)">修改</el-button>
            <el-button size="small" text type="primary" @click="onRowDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 表格 end-->

      <!--分页 start-->
      <el-pagination
          @size-change="onHandleSizeChange"
          @current-change="onHandleCurrentChange"
          class="mt15"
          :pager-count="5"
          :page-sizes="[10, 20, 30]"
          v-model:current-page="tableData.pagination.pageNum"
          background
          v-model:page-size="tableData.pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.pagination.total"
      >
      </el-pagination>
      <!--分页 end-->

    </el-card>
  </div>
</template>

<script lang="ts">

// 定义接口来定义对象的类型
import {defineComponent, onMounted, reactive, toRefs} from "vue";
import {FieldCondition, TableData} from "/@/types/TableData";
import * as baseClassApi from '/@/api/gen/baseClass'
import {ApiResultResponse} from "/@/types/ApiResultResponse";


// 定义接口来定义对象的类型
interface TableDataRow {
  id: number;
  packageName: string,
  code: string;
  fields: string;
  remark: string;
  createTime: string;
  updateTime: string;
}

export default defineComponent({
  name: "index",

  setup() {
    // 初始化表格数据
    const state = reactive<TableData<TableDataRow>>(new TableData<TableDataRow>());

    // 初始化表格数据---这里是调用ajax的
    const initTableData = () => {
      // 过滤条件
      let searchParam: Array<FieldCondition> = [
        {column: 'code', type: 'like', value: ""}
      ]

      // 请求
      baseClassApi.page({
        currentPage: state.tableData.pagination.pageNum,
        fields: searchParam,
        limit: state.tableData.pagination.pageSize,
        orderField: "id",
        asc: false
      }).then((response: ApiResultResponse) => {
        // 表格数据赋值
        state.tableData.data = response.data.records;

        // 分页赋值
        state.tableData.pagination.total = response.data.total;
        state.tableData.pagination.pageNum = response.data.current
        state.tableData.pagination.pageSize = response.data.size
      });

    };

    // 分页改变
    const onHandleSizeChange = (val: number) => {
      state.tableData.pagination.pageSize = val;
      initTableData();
    };
    // 分页改变
    const onHandleCurrentChange = (val: number) => {
      state.tableData.pagination.pageNum = val;
      initTableData();
    };
    // 页面加载时
    onMounted(() => {
      initTableData();
    });

    return {
      onHandleSizeChange,
      onHandleCurrentChange,

      ...toRefs(state),
    }
  }
})
</script>

<style scoped>

</style>