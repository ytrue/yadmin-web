<template>
  <div class="system-dic-container">
    <el-card shadow="hover">
      <!--搜索 start-->
      <div class="system-user-search mb15">

        <el-form
            :model="searchFrom"
            ref="searchFromRef"
            size="default"
            :inline="true"
        >
          <el-form-item label="连接名:" prop="connName">
            <el-input placeholder="请输入连接名" v-model="searchFrom.connName"></el-input>
          </el-form-item>

          <el-form-item label="数据库类型" prop="dbType">
            <el-select v-model="searchFrom.dbType" clearable>
              <el-option label="MySQL" value="MySQL"/>
              <el-option label="Oracle" value="Oracle"/>
              <el-option label="PostgreSQL" value="PostgreSQL"/>
            </el-select>
          </el-form-item>


          <el-form-item>
            <el-button type="success" class="ml10" @click="initTableData">
              <el-icon>
                <ele-Search/>
              </el-icon>
              查询
            </el-button>

            <el-button type="info" class="ml10" @click="resetTableData">
              <el-icon>
                <ele-RefreshLeft/>
              </el-icon>
              重置
            </el-button>
          </el-form-item>
        </el-form>

        <el-button size="default" type="primary" class="ml10" @click="onOpenAddOrUpdate()">
          <el-icon>
            <ele-DocumentAdd/>
          </el-icon>
          新增
        </el-button>

        <el-button size="default" type="danger" class="ml10" @click="deleteTableData()">
          <el-icon>
            <ele-Delete/>
          </el-icon>
          批量删除
        </el-button>
      </div>
      <!--搜索 end-->

      <!-- 表格 start-->
      <el-table
          :data="data"
          ref="tableRef"
          v-loading="loading"
          style="width: 100%"
          @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"/>

        <el-table-column prop="id" label="ID" width="50"/>
        <el-table-column prop="connName" label="连接名"/>
        <el-table-column prop="dbType" label="数据库类型"/>
        <el-table-column prop="connUrl" label="数据库URL"/>
        <el-table-column prop="username" label="用户名"/>
        <el-table-column prop="password" label="密码"/>
        <el-table-column prop="createTime" label="创建时间"/>

        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button size="small" text type="primary" @click="testConnect(scope.row.id)">测试连接</el-button>
            <el-button size="small" text type="primary" @click="onOpenAddOrUpdate(scope.row.id)">修改</el-button>
            <el-button size="small" text type="primary" @click="deleteTableData(scope.row.id)">删除</el-button>
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
          :page-sizes="[10, 50, 100]"
          v-model:current-page="pagination.pageNum"
          background
          v-model:page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
      >
      </el-pagination>
      <!--分页 end-->
    </el-card>

    <!--新增和编辑弹窗-->
    <AddOrUpdate ref="addOrUpdateRef" @handleSubmit="initTableData"/>


  </div>
</template>

<script lang="ts">

// 定义接口来定义对象的类型
import {defineComponent, onMounted, reactive, ref, toRefs} from "vue";
import {FieldCondition, FromSearch, Table} from "/@/types/tableData";
import * as datasourceApi from '/@/api/gen/datasource'
import {ApiResultResponse} from "/@/types/apiResultResponse";
import AddOrUpdate from '/@/views/gen/datasource/component/add-or-update.vue';
import {ElForm, ElMessage, ElMessageBox} from "element-plus";
import {IDatasourceDataTable, IDatasourceSearchFrom} from "/@/types/gen/datasource";
import {test} from "/@/api/gen/datasource";

// 搜索
interface SearchFrom {
  code: string
}

export default defineComponent({
  name: "index",
  components: {AddOrUpdate},
  setup() {

    // 弹窗的ref
    const addOrUpdateRef = ref()
    // 搜索的ref
    const searchFromRef = ref()
    // 表格的
    const tableRef = ref()

    // 初始化搜索表单的数据
    const fromSearch = reactive(new FromSearch<IDatasourceSearchFrom>({
      connName: '',
      dbType: '',
    }))
    // 初始化表格数据
    const table = reactive(new Table<IDatasourceDataTable>())

    // 初始化表格数据---这里是调用ajax的
    const initTableData = () => {
      // 加载中
      table.loading = true

      // 过滤条件
      let fieldCondition: Array<FieldCondition> = [
        {column: 'connName', condition: 'like', value: fromSearch.searchFrom.connName},
        {column: 'dbType', condition: 'eq', value: fromSearch.searchFrom.dbType}
      ]

      // 请求获取数据
      datasourceApi.page({
        currentPage: table.pagination.pageNum,
        fields: fieldCondition,
        limit: table.pagination.pageSize,
        orderField: "id",
        asc: false
      }).then((response: ApiResultResponse) => {
        // 表格数据赋值
        table.data = response.data.records

        // 分页赋值
        table.pagination.total = response.data.total
        table.pagination.pageNum = response.data.current
        table.pagination.pageSize = response.data.size
      }).finally(() => {
        // 加载完毕
        table.loading = false
      })

    }

    // 测试连接
    const testConnect = (id: number) => {
      datasourceApi.test(id).then((response: ApiResultResponse) => {
        ElMessage({type: 'success', message: response.message})
        initTableData()
      })
    }

    // 删除数据
    const deleteTableData = (id: number | undefined = undefined) => {
      const deleteIds: Array<number> = id === undefined ? table.selectIds : [id]
      // 校验是否有删除数据
      if (deleteIds.length === 0) {
        ElMessage({type: 'info', message: '请选择需要删除的数据'})
        return
      }

      ElMessageBox.confirm(
          '您确定要删除记录吗',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
      ).then(() => {
        // 删除
        datasourceApi.remove(deleteIds).then((response: ApiResultResponse) => {
          ElMessage({type: 'success', message: response.message})
          initTableData()
        })
      }).catch(() => {
      })
    }

    // 重置表单数据
    const resetTableData = () => {
      searchFromRef.value?.resetFields()
      initTableData()
    }

    // 打开新增和编辑的弹窗
    const onOpenAddOrUpdate = (id: undefined | number = undefined) => {
      addOrUpdateRef.value.init(id);
    }

    // 复选框变化时
    const handleSelectionChange = (val: IDatasourceDataTable[]) => {
      // 清空之前的
      table.selectIds = []
      val.forEach((item) => {
        table.selectIds.push(item.id)
      })
    }
    // 分页改变
    const onHandleSizeChange = (val: number) => {
      table.pagination.pageSize = val;
      initTableData();
    }
    // 分页改变
    const onHandleCurrentChange = (val: number) => {
      table.pagination.pageNum = val;
      initTableData();
    }
    // 页面加载时
    onMounted(() => {
      initTableData();
    })

    return {
      initTableData,
      resetTableData,
      deleteTableData,
      onHandleSizeChange,
      onHandleCurrentChange,
      onOpenAddOrUpdate,
      handleSelectionChange,
      addOrUpdateRef,
      searchFromRef,
      tableRef,
      testConnect,

      ...toRefs(table),
      ...toRefs(fromSearch),
    }
  }
})
</script>

<style scoped>

</style>

