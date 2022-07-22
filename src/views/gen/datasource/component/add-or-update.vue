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

        <el-form-item label="连接名" prop="connName">
          <el-input v-model="dataForm.connName" placeholder="连接名"/>
        </el-form-item>

        <el-form-item label="数据库类型" prop="dbType">
          <el-select v-model="dataForm.dbType" clearable>
            <el-option label="MySQL" value="MySQL"/>
            <el-option label="Oracle" :disabled="true" value="Oracle"/>
            <el-option label="PostgreSQL" :disabled="true" value="PostgreSQL"/>
          </el-select>
        </el-form-item>

        <el-form-item label="数据库URL" prop="connUrl">
          <el-input v-model="dataForm.connUrl" placeholder="数据库URL"/>
        </el-form-item>

        <el-form-item label="用户名" prop="username">
          <el-input v-model="dataForm.username" placeholder="用户名"/>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="dataForm.password" placeholder="密码"/>
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
import {ApiResultResponse} from "/@/types/apiResultResponse";
import {DialogInputData} from "/@/types/dialogInputData";
import {ElMessage} from "element-plus/es";
import {DatasourceDataForm} from "/@/types/gen/datasource";


export default defineComponent({
  name: 'AddOrUpdate',
  setup: function (props, {emit}) {

    // 表单的ref
    const dataFormRef = ref()

    // 初始化验证规则
    const dataRule: FormRules = reactive<FormRules>({
      connName: [
        {required: true, message: '请输入连接名', trigger: 'blur'},
      ],
      dbType: [
        {required: true, message: '请选择数据库类型', trigger: 'blur'},
      ],
      connUrl: [
        {required: true, message: '请输入数据库URL', trigger: 'blur'},
      ],
      username: [
        {required: true, message: '请输入用户名', trigger: 'blur'},
      ],
      password: [
        {required: true, message: '请输入密码', trigger: 'blur'},
      ],
    })

    // 初始化数据
    const state = reactive(new DialogInputData(new DatasourceDataForm(), dataRule))

    // 初始化数据
    const init = (id: undefined | number) => {
      state.formId = id || 0

      if (!state.formId) {
        // 把弹窗打开
        state.isShowDialog = true
        return
      }
      // 调取ajax获取详情数据
      datasourceApi
          .detail(state.formId)
          .then((response: ApiResultResponse) => {
            // 把弹窗打开
            state.isShowDialog = true
            // 进行赋值
            state.dataForm = response.data
          })
    }


    // 提交表单
    const onSubmit = (formEl: FormInstance | undefined) => {
      formEl?.validate((valid) => {
        if (valid) {
          // 下面就是调用ajax
          datasourceApi
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
    }
  },
});
</script>
