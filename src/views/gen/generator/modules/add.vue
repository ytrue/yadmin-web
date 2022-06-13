<template>
    <a-modal
            title="新增"
            :width="720"
            :visible="visible"
            :confirmLoading="confirmLoading"
            :maskClosable="false"
            @ok="handleSubmit"
            @cancel="handleCancel"
            :bodyStyle="bodyStyle">

        <a-spin :spinning="confirmLoading">
            <a-form :form="form">

                <a-form-item label="数据源" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-select placeholder="数据源"
                              @change="getTableList"
                              v-decorator="['datasourceId',{rules:[{required: true, message: '请选择数据源'}]}]">

                        <a-select-option :key="0">默认数据源</a-select-option>
                        <a-select-option
                                :key="item.id"
                                :value="item.id"
                                v-for="item in datasourceList"
                        >
                            {{item.connName}}
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="选择表" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-select placeholder="选择表"
                              v-decorator="['tableName',{rules:[{required: true, message: '请选择数据表'}]}]">

                        <a-select-option
                                :key="item.tableName"
                                :value="item.tableName"
                                v-for="item in tableList"
                        >
                            {{item.tableName}}
                        </a-select-option>
                    </a-select>
                </a-form-item>

            </a-form>
        </a-spin>

    </a-modal>
</template>

<script>
    import * as tableInfoApi from '@/api/gen/tableInfo'
    import * as datasourceApi from '@/api/gen/datasource'


    export default {
        name: "add",
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
                // 数据源列表
                datasourceList: [],
                // 数据表列表
                tableList: []

            }
        },
        methods: {
            /**
             *数据初始化
             */
            init(id) {
                this.formId = id || 0
                datasourceApi.list(this.formId).then((response) => {
                    this.visible = true
                    this.confirmLoading = false
                    this.datasourceList = response.data.data
                })
            },

            /**
             *获取数据表
             */
            getTableList(id) {
                tableInfoApi.list(id).then((response) => {
                    this.tableList = response.data.data
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
                        this.onFormSubmit(values)
                    }
                })
            },
            /**
             * 提交到后端api
             */
            onFormSubmit(values) {
                tableInfoApi.importTable(values).then((result) => {
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
