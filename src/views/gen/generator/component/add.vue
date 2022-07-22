<template>
  <div class="system-add-dic-container">
    <el-dialog
        @closed="onCancel(dataFormRef)"
        draggable
        :title="!formId ? '新增' : '修改'"
        v-model="isShowDialog"
        width="769px">

      <el-form
          :model="dataForm"
          :rules="dataRule"
          ref="dataFormRef"
          label-width="120px"
      >

        <el-form-item label="数据源" prop="datasourceId">
          <el-select v-model="dataForm.datasourceId " @change="getTableList" filterable placeholder="数据源">
            <el-option label="默认数据源" :value="0"/>
            <el-option
                v-for="item in datasourceList"
                :key="item.id"
                :label="item.connName"
                :value="item.id"
            />
          </el-select>
        </el-form-item>


        <el-form-item label="数据表" prop="tableName">
          <el-select v-model="dataForm.tableName " placeholder="请选中数据表" filterable clearable>
            <el-option
                v-for="item in tableInfoList"
                :key="item.tableName"
                :label="item.tableName"
                :value="item.tableName"
            />
          </el-select>
        </el-form-item>

      </el-form>

      <template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel(dataFormRef)" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit(dataFormRef)" size="default">提 交</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, ref, toRefs} from 'vue';
import {FormInstance, FormRules} from "element-plus";
import * as datasourceApi from '/@/api/gen/datasource'
import * as tableInfoApi from '/@/api/gen/tableInfo'
import {ApiResultResponse} from "/@/types/apiResultResponse";
import {DialogInputData} from "/@/types/dialogInputData";
import {ElMessage} from "element-plus/es";
import {IDatasourceDataTable} from "/@/types/gen/datasource";
import {ImportTableData, ITableInfoDataTable} from "/@/types/gen/tableInfo";


export default defineComponent({
  name: 'add',
  setup: function (props, {emit}) {

    // 表单的ref
    const dataFormRef = ref()

    // 初始化验证规则
    const dataRule: FormRules = reactive<FormRules>({
      datasourceId1: [
        {required: true, message: '请选择数据源', trigger: 'blur'},
      ],
      tableName1: [
        {required: true, message: '请选择数据表', trigger: 'blur'},
      ]
    })

    // 初始化数据
    const state = reactive(new DialogInputData(new ImportTableData(), dataRule));

    // 初始下拉框数据
    let datasourceList = ref<Array<IDatasourceDataTable>>([]);
    let tableInfoList = ref<Array<ITableInfoDataTable>>([]);

    // 初始化数据
    const init = () => {
      datasourceApi
          .list()
          .then((response: ApiResultResponse) => {
            // 进行赋值
            datasourceList.value = response.data
            // 把弹窗打开
            state.isShowDialog = true
          })
    };

    // 获取数据表
    const getTableList = (id: number) => {
      tableInfoApi.list(id).then((response: ApiResultResponse) => {
        // 进行赋值
        tableInfoList.value = response.data
      })
    }


    // 提交表单
    const onSubmit = (formEl: FormInstance | undefined) => {
      formEl?.validate((valid) => {
        if (valid) {
          // 下面就是调用ajax
          tableInfoApi
              .importTable(state.dataForm)
              .then((response: ApiResultResponse) => {
                ElMessage({type: 'success', message: response.message})
                // 通知父端组件提交完成了
                emit('handleSubmit')
                onCancel(formEl)
              })
        } else {
          return false
        }
      })
    }

    // 关闭弹窗
    const onCancel = (formEl: FormInstance | undefined) => {
      state.isShowDialog = false;
      formEl?.resetFields()
    }

    return {
      init,
      onCancel,
      onSubmit,
      dataFormRef,
      datasourceList,
      getTableList,
      tableInfoList,
      ...toRefs(state),
    };
  },
});
</script>
