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

                <a-form-item label="基类编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input placeholder="基类编码"
                             v-decorator="['code',{rules: [{required: true, message: '请输入基类编码'}]}]"/>
                </a-form-item>

                <a-form-item label="基类包名" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input placeholder="基类包名"
                             v-decorator="['packageName',{rules: [{required: true, message: '请输入基类包名'}]}]"/>
                </a-form-item>

                <a-form-item label="基类字段" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input placeholder="基类字段，多个字段，用英文逗号分隔"
                             v-decorator="['fields',{rules: [{required: true, message: '请输入基类字段，多个字段，用英文逗号分隔'}]}]"/>
                </a-form-item>

                <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input placeholder="备注"
                             v-decorator="['remark']"/>
                </a-form-item>
            </a-form>
        </a-spin>

    </a-modal>
</template>

<script>
    import _ from "lodash";
    import * as Api from '@/api/gen/baseClass'

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
                    const data1 = _.pick(response.data.data, ['packageName', 'code', 'fields', 'remark']);
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
