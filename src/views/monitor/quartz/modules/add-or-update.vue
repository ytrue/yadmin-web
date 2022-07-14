<template>
    <a-modal
            :title="!formId ? '新增' : '修改'"
            :width="720"
            :visible="visible"
            :confirmLoading="confirmLoading"
            :maskClosable="false"
            @ok="handleSubmit"
            @cancel="handleCancel"
            :bodyStyle="bodyStyle"
    >
        <a-spin :spinning="confirmLoading">
            <a-form :form="form">

                <a-form-item label="bean名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input
                            placeholder="spring bean名称, 如: testTask"
                            v-decorator="['beanName', {rules: [{required: true, message: 'beanName不能为空'}]}]"
                    />
                </a-form-item>

                <a-form-item label="methodName" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input
                            placeholder="请输入方法名称"
                            v-decorator="['methodName', {rules: [{required: true, message: '方法名称不能为空'}]}]"
                    />
                </a-form-item>

                <a-form-item label="参数" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input
                            v-decorator="['params']"
                    />
                </a-form-item>


                <a-form-item label="cron表达式" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input
                            placeholder="如: 0 0 12 * * ?"
                            v-decorator="['cronExpression', {rules: [{required: true, message: 'cron表达式不能为空'}]}]"
                    />
                </a-form-item>

                <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input
                            v-decorator="['remark']"
                    />
                </a-form-item>


            </a-form>
        </a-spin>
    </a-modal>
</template>

<script>

    import {info, saveAndUpdate} from '@/api/monitor/quartz'

    export default {
        name: "AddOrUpdate",
        data() {
            return {
                //是否弹窗
                visible: false,
                // modal(对话框)确定按钮 loading
                confirmLoading: true,
                // 当前表单元素
                form: this.$form.createForm(this),
                //id
                formId: null,
                // 当前记录
                record: {},
                // 标签布局属性
                labelCol: {
                    span: 7
                },
                // 输入框布局属性
                wrapperCol: {
                    span: 13
                },
                //弹窗样式
                bodyStyle: {
                    'max-height': '500px',
                    'overflow': 'auto'
                },
                status: 0
            }
        },
        methods: {
            /**
             *数据初始化
             */
            init(id) {
                this.confirmLoading = true
                this.visible = true
                this.formId = id || 0
                if (this.formId) {
                    info(this.formId).then(({data}) => {
                        //设置值
                        const data1 = data.data
                        this.form.setFieldsValue({
                            beanName: data1.beanName,
                            remark: data1.remark,
                            methodName: data1.methodName,
                            params: data1.params,
                            cronExpression: data1.cronExpression,
                        })
                        this.status = data1.status
                        this.confirmLoading = false
                    })

                } else {
                    this.confirmLoading = false
                }
            },


            /**
             * 确认按钮
             */
            handleSubmit(e) {
                // if (this.confirmLoading === true) return
                e.preventDefault()
                const {form: {validateFields}} = this
                // 表单验证
                validateFields((errors, values) => {
                    // 提交到后端api
                    if (errors === null) {
                        values.jobId = this.formIdyar
                        values.status = this.status
                        this.onFormSubmit(values)
                    }
                })
            },

            /**
             * 提交到后端api
             */
            onFormSubmit(values) {
                this.confirmLoading = true
                saveAndUpdate(values).then((result) => {
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
                this.visible = false
                this.form.resetFields()
            },

        }
    }
</script>

<style scoped>

</style>
