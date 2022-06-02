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

                <a-form-item label="基类编码" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                    <a-input placeholder="基类编码"
                             v-decorator="['code',{rules: [{required: true, message: '请输入基类编码'}]}]"/>
                </a-form-item>

                <a-form-item label="基类包名" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                    <a-input placeholder="基类包名"
                             v-decorator="['packageName',{rules: [{required: true, message: '请输入基类包名'}]}]"/>
                </a-form-item>

                <a-form-item label="基类字段" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                    <a-input placeholder="基类字段，多个字段，用英文逗号分隔"
                             v-decorator="['fields',{rules: [{required: true, message: '请输入基类字段，多个字段，用英文逗号分隔'}]}]"/>
                </a-form-item>

                <a-form-item label="备注" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                    <a-input placeholder="备注"
                             v-decorator="['remark']"/>
                </a-form-item>
            </a-form>
        </a-spin>

    </a-modal>
</template>

<script>

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
                this.visible = true
                this.formId = id || 0
            },
            /**
             * 确认按钮
             */
            handleSubmit(e) {
                e.preventDefault()
                const {form: {validateFields}} = this
                // 表单验证
                validateFields((errors, values) => {
                    console.log(123)
                    // 提交到后端api
                    if (errors === null) {
                        //  this.confirmLoading = true
                        values.userId = this.formId
                        this.onFormSubmit(values)
                    }
                })
            },
            /**
             * 提交到后端api
             */
            onFormSubmit() {
                // alert(123)
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
