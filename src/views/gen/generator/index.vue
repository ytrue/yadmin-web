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
          <el-form-item label="基类编码:" prop="code">
            <el-input placeholder="请输入基类编码" v-model="searchFrom.code"></el-input>
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

        <el-button size="default" type="primary" class="ml10" @click="onOpenAdd">
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
        <el-table-column prop="tableName" label="表名"/>
        <el-table-column prop="tableComment" label="表说明"/>
        <el-table-column prop="className" label="类名"/>
        <el-table-column prop="createTime" label="创建时间"/>

        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" text type="primary" @click="onOpenCode(scope.row.id)">代码生成</el-button>
            <el-button size="small" text type="primary" @click="onOpenUpdate(scope.row.id)">修改</el-button>
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
    <generate ref="generateRef" @handleSubmit="initTableData"/>
    <add ref="addRef" @handleSubmit="initTableData"/>
    <update ref="updateRef" @handleSubmit="initTableData"/>


  </div>
</template>

<script lang="ts">

// 定义接口来定义对象的类型
import {defineComponent, onMounted, reactive, ref, toRefs} from "vue";
import {FieldCondition, FromSearch, Table} from "/@/types/tableData";
import * as tableInfoApi from '/@/api/gen/tableInfo'
import {ApiResultResponse} from "/@/types/apiResultResponse";
import generate from '/@/views/gen/generator/component/generate.vue';
import add from '/@/views/gen/generator/component/add.vue';
import update from '/@/views/gen/generator/component/update.vue';
import {ElForm, ElMessage, ElMessageBox} from "element-plus";
import {ITableInfoDataTable, ITableInfoSearchFrom} from "/@/types/gen/tableInfo";

export default defineComponent({
  name: "index",
  components: {generate, add, update},
  setup() {

    // code弹窗的ref
    const generateRef = ref()
    const addRef = ref()
    const updateRef = ref()

    // 搜索的ref
    const searchFromRef = ref()
    // 表格的
    const tableRef = ref()

    // 初始化搜索表单的数据
    const fromSearch = reactive(new FromSearch<ITableInfoSearchFrom>({
      tableName: ''
    }))
    // 初始化表格数据
    const table = reactive(new Table<ITableInfoDataTable>())

    // 初始化表格数据---这里是调用ajax的
    const initTableData = () => {
      // 加载中
      table.loading = true

      // 过滤条件
      let fieldCondition: Array<FieldCondition> = [
        {column: 'tableName', condition: 'like', value: fromSearch.searchFrom.tableName}
      ]

      // 请求获取数据
      tableInfoApi.page({
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
        tableInfoApi.remove(deleteIds).then((response: ApiResultResponse) => {
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

    // 打开代码生成的弹窗
    const onOpenCode = (id: undefined | number = undefined) => {
      generateRef.value.init(id);
    }

    // 打开新增的弹窗
    const onOpenAdd = () => {
      addRef.value.init();
    }

    // 打开修改的弹窗
    const onOpenUpdate = (id: number) => {
      updateRef.value.init(id);
    }

    // 复选框变化时
    const handleSelectionChange = (val: ITableInfoDataTable[]) => {
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
      onOpenCode,
      handleSelectionChange,
      onOpenAdd,
      onOpenUpdate,
      addRef,
      generateRef,
      searchFromRef,
      tableRef,
      updateRef,
      ...toRefs(table),
      ...toRefs(fromSearch),
    }
  }
})
</script>

<style scoped>

</style>

