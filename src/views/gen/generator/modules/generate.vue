<template>
    <a-modal
            title="生成代码"
            :width="720"
            :visible="visible"
            :confirmLoading="confirmLoading"
            :maskClosable="false"
            @ok="handleSubmit"
            @cancel="handleCancel"
            :bodyStyle="bodyStyle">

        <a-spin :spinning="confirmLoading">
            <a-form :form="form">

                <a-form-item label="表名" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input placeholder="表名"
                             :disabled="true"
                             v-decorator="['tableName']"/>
                </a-form-item>

                <a-form-item label="功能名" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input placeholder="功能名"
                             v-decorator="['tableComment',{rules: [{required: true, message: '请输入属性类型'}]}]"/>
                </a-form-item>

                <a-form-item label="类名" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input placeholder="类名"
                             v-decorator="['className',{rules: [{required: true, message: '请输入类名'}]}]"/>
                </a-form-item>


                <a-form-item label="基类" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-select placeholder="基类"
                              :allow-clear="true"
                              v-decorator="['baseclassId']">
                        <a-select-option
                                :key="item.id"
                                :value="item.id"
                                v-for="item in baseclassList"
                        >
                            {{item.code}}
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="模块名" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input placeholder="模块名"
                             v-decorator="['moduleName']"/>
                </a-form-item>

                <a-form-item label="子模块名" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input placeholder="子模块名"
                             v-decorator="['subModuleName']"/>
                </a-form-item>

                <a-form-item label="项目包名" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input placeholder="项目包名"
                             v-decorator="['packageName',{rules: [{required: true, message: '请输入项目包名'}]}]"/>
                </a-form-item>

                <a-form-item label="版本号" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input placeholder="版本号"
                             v-decorator="['version']"/>
                </a-form-item>

                <a-form-item label="默认作者" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input placeholder="默认作者"
                             v-decorator="['author',{rules: [{required: true, message: '请输入默认作者'}]}]"/>
                </a-form-item>

                <a-form-item label="作者邮箱" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input placeholder="作者邮箱"
                             v-decorator="['email']"/>
                </a-form-item>

                <a-form-item label="后端生成路径" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input placeholder="后端生成路径"
                             v-decorator="['backendPath',{rules: [{required: true, message: '请输入后端生成路径'}]}]"/>
                </a-form-item>

                <a-form-item label="前端生成路径" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input placeholder="前端生成路径"
                             v-decorator="['frontendPath',{rules: [{required: true, message: '请输入前端生成路径'}]}]"/>
                </a-form-item>

            </a-form>
        </a-spin>

        <template slot="footer">
            <a-button @click="handleCancel">取消</a-button>
            <a-button type="primary" @click="handleSubmit('submit',$event)">保存</a-button>
            <a-button type="danger" @click="handleSubmit('code',$event)">生成代码</a-button>
        </template>
    </a-modal>
</template>

<script>
    import _ from "lodash";
    import * as baseClassApi from '@/api/gen/baseClass'
    import * as tableInfoApi from '@/api/gen/tableInfo'
    import * as generateApi from '@/api/gen/generate'

    export default {
        name: "generate",
        data() {
            return {
                disable: true,
                //是否弹窗
                visible: false,
                //id
                formId: null,
                //是否禁用
                disabled: false,
                // modal(对话框)确定按钮 loading
                confirmLoading: false,
                // 标签布局属性
                labelCol: {
                    span: 4
                },
                // 输入框布局属性
                wrapperCol: {
                    span: 20
                },
                //弹窗样式
                bodyStyle: {
                    //'max-height': '700px',
                    'overflow': 'auto'
                },
                // 当前表单元素
                form: this.$form.createForm(this),
                // 基类列表
                baseclassList: []

            }
        },
        methods: {
            /**
             *数据初始化
             */
            async init(id) {
                this.formId = id || 0

                await baseClassApi.list().then((response) => {
                    this.baseclassList = response.data.data
                })

                await tableInfoApi.detail(this.formId).then((response) => {
                    this.visible = true
                    this.confirmLoading = false
                    //设置值
                    const data1 = _.pick(response.data.data, [
                        'tableName',
                        'tableComment',
                        'className',
                        'baseclassId',
                        'moduleName',
                        'subModuleName',
                        'packageName',
                        'version',
                        'author',
                        'email',
                        'backendPath',
                        'frontendPath',
                    ]);
                    // 渲染之前不能加入填充数据...
                    this.$nextTick(() => {
                        this.form.setFieldsValue(data1)
                    })
                })

            },

            /**
             * 确认按钮
             */
            handleSubmit(type, e) {
                e.preventDefault()
                const {form: {validateFields}} = this
                // 表单验证
                validateFields((errors, values) => {
                    // 提交到后端api
                    if (errors === null) {
                        values.id = this.formId

                        if (type === 'code') {
                            this.generatorCode(values)
                        } else {
                            this.onFormSubmit(values)
                        }
                    }
                })
            },

            /**
             * 生成code
             */
            generatorCode(values) {
                generateApi.code(values).then((result) => {
                    // 显示成功
                    this.$message.success(result.data.message, 1.5)
                    // 关闭对话框
                    this.handleCancel()
                    // 通知父端组件提交完成了
                    this.$emit('handleSubmit', values)
                }).finally(() => {
                    this.confirmLoading = false
                })
            },


            /**
             * 提交到后端api
             */
            onFormSubmit(values) {
                tableInfoApi.saveAndUpdate(values).then((result) => {
                    // 显示成功
                    this.$message.success(result.data.message, 1.5)
                    // 关闭对话框
                    this.handleCancel()
                    // 通知父端组件提交完成了
                    this.$emit('handleSubmit', values)
                }).finally(() => {
                    this.confirmLoading = false
                })
            },
            /**
             * 关闭对话框事件
             */
            handleCancel() {
                this.confirmLoading = true
                this.visible = false
                this.disabled = false
                this.form.resetFields()
            },
        }
    }
</script>

<style scoped>

</style>
