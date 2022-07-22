<template>
  <div class="system-add-dic-container">
    <el-dialog
        @closed="onCancel"
        draggable
        title="修改"
        v-model="isShowDialog"
        width="90%">

      <!--content-->
      <el-table style="width: 100%" :data="dataForm">
        <el-table-column prop="sort" label="#" width="50"/>
        <el-table-column prop="columnName" label="字段名"/>
        <el-table-column prop="attrName" label="属性名"/>
        <el-table-column prop="attrType" label="属性类型"/>
        <el-table-column prop="columnComment" label="字段说明"/>


        <el-table-column label="列表">
          <template #default="scope">
            <el-switch v-model="scope.row.isList"/>
          </template>
        </el-table-column>

        <el-table-column label="查询">
          <template #default="scope">
            <el-switch v-model="scope.row.isQuery"/>
          </template>
        </el-table-column>


        <el-table-column label="查询方式">
          <template #default="scope">
            <el-select v-model="scope.row.queryType" clearable filterable>
              <el-option label="等于" value="eq"/>
              <el-option label="不等于" value="ne"/>
              <el-option label="大于" value="gt"/>
              <el-option label="小于" value="lt"/>
              <el-option label="大于等于" value="ge"/>
              <el-option label="小于等于" value="le"/>
              <el-option label="模糊查询" value="like"/>
              <el-option label="左模糊查询" value="likeLeft"/>
              <el-option label="右模糊查询" value="likeRight"/>
            </el-select>
          </template>
        </el-table-column>


        <el-table-column label="表单">
          <template #default="scope">
            <el-switch v-model="scope.row.isForm"/>
          </template>
        </el-table-column>

        <el-table-column label="必填">
          <template #default="scope">
            <el-switch v-model="scope.row.isRequired"/>
          </template>
        </el-table-column>

        <el-table-column label="表单类型">
          <template #default="scope">
            <el-select v-model="scope.row.formType" clearable filterable>
              <el-option label="单行文本" value="text"/>
              <el-option label=" 多行文本" value="textarea"/>
              <el-option label="富文本编辑器" value="editor"/>
              <el-option label="下拉框" value="select"/>
              <el-option label="单选按钮" value="radio"/>
              <el-option label="复选框" value="checkbox"/>
              <el-option label="日期" value="date"/>
              <el-option label="日期时间" value="datetime"/>
            </el-select>
          </template>
        </el-table-column>

      </el-table>

      <template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">提 交</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs} from 'vue';
import * as tableFieldApi from '/@/api/gen/tableField'
import {ApiResultResponse} from "/@/types/apiResultResponse";
import {DialogInputData} from "/@/types/dialogInputData";
import {ITableFieldDataForm} from "/@/types/gen/tableField";
import {ElMessage} from "element-plus/es";


export default defineComponent({
  name: 'update',
  setup: function (props, {emit}) {
    // 初始化数据
    const state = reactive(new DialogInputData(new Array<ITableFieldDataForm>()))

    // 初始化数据
    const init = (id: number) => {
      state.formId = id || 0
      tableFieldApi.list(id).then((response: ApiResultResponse) => {
        // 进行赋值
        state.dataForm = response.data
        // 把弹窗打开
        state.isShowDialog = true
      })
    }

    // 提交表单
    const onSubmit = () => {
      tableFieldApi.batchUpdate(state.dataForm)
          .then((response: ApiResultResponse) => {
            ElMessage({type: 'success', message: response.message})
            // 通知父端组件提交完成了
            emit('handleSubmit')
            onCancel()
          })
    }

    // 关闭弹窗
    const onCancel = () => {
      state.isShowDialog = false;
    }

    return {
      init,
      onCancel,
      onSubmit,
      ...toRefs(state),
    };
  },
});
</script>
