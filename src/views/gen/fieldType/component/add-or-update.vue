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

        <el-form-item label="字段类型" prop="columnType">
          <el-input v-model="dataForm.columnType" placeholder="字段类型"/>
        </el-form-item>

        <el-form-item label="属性类型" prop="attrType">
          <el-input v-model="dataForm.attrType" placeholder="属性类型"/>
        </el-form-item>

        <el-form-item label="属性包名" prop="packageName">
          <el-input v-model="dataForm.packageName" placeholder="属性包名"/>
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
import * as fieldTypeApi from '/@/api/gen/fieldType'
import {ApiResultResponse} from "/@/types/ApiResultResponse";
import {DialogInputData} from "/@/types/DialogInputData";
import {ElMessage} from "element-plus/es";
import {FieldTypeDataForm} from "/@/types/gen/FieldType";


export default defineComponent({
  name: 'AddOrUpdate',
  setup: function (props, {emit}) {

    // 表单的ref
    const dataFormRef = ref()

    // 初始化验证规则
    const dataRule: FormRules = reactive<FormRules>({
      columnType: [
        {required: true, message: '请输入字段类型', trigger: 'blur'},
      ],
      attrType: [
        {required: true, message: '请输入属性类型', trigger: 'blur'},
      ],
    })

    // 初始化数据
    const state = reactive(new DialogInputData(new FieldTypeDataForm(), dataRule));

    // 初始化数据
    const init = (id: undefined | number) => {
      state.formId = id || 0

      if (!state.formId) {
        // 把弹窗打开
        state.isShowDialog = true
        return
      }
      // 调取ajax获取详情数据
      fieldTypeApi
          .detail(state.formId)
          .then((response: ApiResultResponse) => {
            // 把弹窗打开
            state.isShowDialog = true
            // 进行赋值
            state.dataForm = response.data
          })
    };


    // 提交表单
    const onSubmit = (formEl: FormInstance | undefined) => {
      formEl?.validate((valid) => {
        if (valid) {
          // 下面就是调用ajax
          fieldTypeApi
              .saveAndUpdate(state.dataForm)
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
      ...toRefs(state),
    };
  },
});
</script>
