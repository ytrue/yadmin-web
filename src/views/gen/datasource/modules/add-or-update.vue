<template>
    <a-modal
            :title="!formId ? '新增' : '修改'"
            :width="720"
            :visible="visible"
            :confirmLoading="confirmLoading"
            :maskClosable="false"
            @ok="handleSubmit"
            @cancel="handleCancel"
            :bodyStyle="bodyStyle">

        <a-spin :spinning="confirmLoading">
            <a-form :form="form">

                <a-form-item label="连接名" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input placeholder="连接名"
                             v-decorator="['connName',{rules: [{required: true, message: '请输入连接名'}]}]"/>
                </a-form-item>

                <a-form-item label="数据库类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-select placeholder="数据库类型"
                              v-decorator="['dbType',{rules:[{required: true, message: '请选择数据库类型'}]}]">
                        <a-select-option value="MySQL">
                            MySQL
                        </a-select-option>
                        <a-select-option value="Oracle" :disabled="true">
                            Oracle
                        </a-select-option>
                        <a-select-option value="PostgreSQL" :disabled="true">
                            PostgreSQL
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="数据库URL" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input placeholder="数据库URL"
                             v-decorator="['connUrl',{rules: [{required: true, message: '请输入数据库URL'}]}]"/>
                </a-form-item>

                <a-form-item label="用户名" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input placeholder="用户名"
                             v-decorator="['username',{rules: [{required: true, message: '请输入用户名'}]}]"/>
                </a-form-item>

                <a-form-item label="密码" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input placeholder="密码"
                             v-decorator="['password',{rules: [{required: true, message: '请输入密码'}]}]"/>
                </a-form-item>

            </a-form>
        </a-spin>

    </a-modal>
</template>

<script>
    import _ from "lodash";
    import * as Api from '@/api/gen/datasource'

    export default {
        name: "add-or-update",
        data() {
            return {
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
                    'max-height': '500px',
                    'overflow': 'auto'
                },
                // 当前表单元素
                form: this.$form.createForm(this),

            }
        },
        methods: {
            /**
             *数据初始化
             */
            init(id) {
                this.formId = id || 0

                if (!this.formId) {
                    this.visible = true
                    this.confirmLoading = false
                    return
                }

                Api.detail(this.formId).then((response) => {
                    this.visible = true
                    this.confirmLoading = false
                    //设置值
                    const data1 = _.pick(response.data.data, ['connName', 'dbType', 'connUrl', 'username', 'password']);
                    // 渲染之前不能加入填充数据...
                    this.$nextTick(() => {
                        this.form.setFieldsValue(data1)
                    })
                })
            },
            /**
             * 确认按钮
             */
            handleSubmit(e) {
                e.preventDefault()
                const {form: {validateFields}} = this
                // 表单验证
                validateFields((errors, values) => {
                    // 提交到后端api
                    if (errors === null) {
                        values.id = this.formId
                        this.onFormSubmit(values)
                    }
                })
            },
            /**
             * 提交到后端api
             */
            onFormSubmit(values) {
                Api.saveAndUpdate(values).then((result) => {
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
