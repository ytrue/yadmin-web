<template>
  <div class="system-add-dic-container">
    <el-dialog
        @closed="onCancel(dataFormRef)"
        draggable
        title="生成代码"
        v-model="isShowDialog"
        width="769px">

      <el-form
          :model="dataForm"
          :rules="dataRule"
          ref="dataFormRef"
          label-width="120px"
      >

        <el-form-item label="表名" prop="tableName">
          <el-input v-model="dataForm.tableName" disabled placeholder="表名"/>
        </el-form-item>

        <el-form-item label="功能名" prop="tableComment">
          <el-input v-model="dataForm.tableComment" placeholder="功能名"/>
        </el-form-item>

        <el-form-item label="类名" prop="className">
          <el-input v-model="dataForm.className" placeholder="类名"/>
        </el-form-item>

        <el-form-item label="基类" prop="baseclassId">
          <el-select v-model="dataForm.baseclassId " placeholder="基类" clearable>
            <el-option
                v-for="item in baseClassList"
                :key="item.id"
                :label="item.code"
                :value="item.id"
            />
          </el-select>
        </el-form-item>


        <el-form-item label="模块名" prop="moduleName">
          <el-input v-model="dataForm.moduleName" placeholder="模块名"/>
        </el-form-item>

        <el-form-item label="子模块名" prop="subModuleName">
          <el-input v-model="dataForm.subModuleName" placeholder="子模块名"/>
        </el-form-item>

        <el-form-item label="项目包名" prop="packageName">
          <el-input v-model="dataForm.packageName" placeholder="项目包名"/>
        </el-form-item>

        <el-form-item label="版本号" prop="version">
          <el-input v-model="dataForm.version" placeholder="版本号"/>
        </el-form-item>

        <el-form-item label="默认作者" prop="author">
          <el-input v-model="dataForm.author" placeholder="默认作者"/>
        </el-form-item>

        <el-form-item label="作者邮箱" prop="email">
          <el-input v-model="dataForm.email" placeholder="作者邮箱"/>
        </el-form-item>

        <el-form-item label="后端生成路径" prop="backendPath">
          <el-input v-model="dataForm.backendPath" placeholder="后端生成路径"/>
        </el-form-item>

        <el-form-item label="前端生成路径" prop="frontendPath">
          <el-input v-model="dataForm.frontendPath" placeholder="前端生成路径"/>
        </el-form-item>


      </el-form>

      <template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel(dataFormRef)" size="default">取 消</el-button>
          <el-button type="primary" @click="onSubmit(dataFormRef,'save')" size="default">保 存</el-button>
					<el-button type="danger" @click="onSubmit(dataFormRef,'code')" size="default">生成代码</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, ref, toRefs} from 'vue';
import {ElMessage, FormInstance, FormRules} from "element-plus";
import * as tableInfoApi from '/@/api/gen/tableInfo'
import * as generateApi from '/@/api/gen/generate'
import * as baseClassApi from '/@/api/gen/baseClass'
import {ApiResultResponse} from "/@/types/apiResultResponse";
import {DialogInputData} from "/@/types/dialogInputData";
import {TableInfoDataForm} from "/@/types/gen/tableInfo";
import {IBaseClassDataTable} from "/@/types/gen/baseClass";


export default defineComponent({
  name: 'generate',
  setup: function (props, {emit}) {

    // 表单的ref
    const dataFormRef = ref()

    // 初始化验证规则
    const dataRule: FormRules = reactive<FormRules>({
      tableComment: [
        {required: true, message: '请输入属性类型', trigger: 'blur'},
      ],
      className: [
        {required: true, message: '请输入类名', trigger: 'blur'},
      ],
      packageName: [
        {required: true, message: '请输入项目包名', trigger: 'blur'},
      ],
      author: [
        {required: true, message: '请输入默认作者', trigger: 'blur'},
      ],
      backendPath: [
        {required: true, message: '请输入后端生成路径', trigger: 'blur'},
      ],
      frontendPath: [
        {required: true, message: '请输入前端生成路径', trigger: 'blur'},
      ],
    })

    // 初始化数据
    const state = reactive(new DialogInputData(new TableInfoDataForm(), dataRule))
    // 初始化基类列表数据
    let baseClassList = ref<Array<IBaseClassDataTable>>([])

    // 初始化数据
    const init = async (id: number) => {
      state.formId = id

      // 先去获取
      await baseClassApi.list().then((response: ApiResultResponse) => {
        // 赋值
        baseClassList.value = response.data
      })

      // 调取ajax获取详情数据
      await tableInfoApi
          .detail(state.formId)
          .then((response: ApiResultResponse) => {
            // 进行赋值
            state.dataForm = response.data
            // 把弹窗打开
            state.isShowDialog = true
          })
    }


    // 提交表单
    const onSubmit = (formEl: FormInstance | undefined, type: string) => {
      formEl?.validate((valid) => {
        if (valid) {

          if (type === 'code') {
            //下面就是调用ajax
            generateApi
                .code(state.dataForm)
                .then((response: ApiResultResponse) => {
                  ElMessage({type: 'success', message: response.message})
                  // 通知父端组件提交完成了
                  emit('handleSubmit')
                  onCancel(formEl)
                })
          } else {
            //下面就是调用ajax
            tableInfoApi
                .saveAndUpdate(state.dataForm)
                .then((response: ApiResultResponse) => {
                  ElMessage({type: 'success', message: response.message})
                  // 通知父端组件提交完成了
                  emit('handleSubmit')
                  onCancel(formEl)
                })
          }
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
      baseClassList,
      ...toRefs(state),
    };
  },
});
</script>
