<template>
    <a-modal
            title="编辑"
            width="90%"
            :visible="visible"
            :confirmLoading="confirmLoading"
            :maskClosable="false"
            @ok="handleSubmit"
            :pagination="pagination"
            @cancel="handleCancel"
            :bodyStyle="bodyStyle">
        <a-card>
            <a-table
                    row-key="id"
                    :columns="columns"
                    :pagination="pagination"
                    :loading="confirmLoading"
                    :data-source="dataSource">

                <span slot="list" slot-scope="text, record">
                   <a-switch v-model="record.list"/>
                </span>>
                <span slot="query" slot-scope="text, record">
                   <a-switch v-model="record.query"/>
                </span>>
                <span slot="queryType" slot-scope="text, record">
                   <a-select v-model="record.queryType" style="width: 120px">
                       <a-select-option value="=">
                            等于
                       </a-select-option>
                        <a-select-option value="!=">
                            不等于
                       </a-select-option>
                        <a-select-option value=">">
                            大于
                       </a-select-option>
                        <a-select-option value=">=">
                            大于等于
                       </a-select-option>
                        <a-select-option value="<=">
                            小于等于
                       </a-select-option>
                        <a-select-option value="like">
                            模糊查询
                       </a-select-option>
                       <a-select-option value="leftLike">
                            左模糊查询
                       </a-select-option>
                       <a-select-option value="rightLike">
                            右模糊查询
                       </a-select-option>
                   </a-select>
                </span>
                <span slot="form" slot-scope="text, record">
                   <a-switch v-model="record.form"/>
                </span>>
                <span slot="required" slot-scope="text, record">
                   <a-switch v-model="record.required"/>
                </span>>
                <span slot="formType" slot-scope="text, record">
                   <a-select v-model="record.formType" style="width: 130px">
                       <a-select-option value="text">
                            单行文本
                       </a-select-option>
                       <a-select-option value="textarea">
                            多行文本
                       </a-select-option>
                       <a-select-option value="editor">
                            富文本编辑器
                        </a-select-option>
                       <a-select-option value="select">
                            下拉框
                        </a-select-option>
                       <a-select-option value="radio">
                            单选按钮
                        </a-select-option>
                       <a-select-option value="checkbox">
                            复选框
                        </a-select-option>
                       <a-select-option value="date">
                            日期
                        </a-select-option>
                       <a-select-option value="datetime">
                            日期时间
                        </a-select-option>
                  </a-select>
                </span>>
            </a-table>
        </a-card>
    </a-modal>
</template>

<script>
    import * as tableFieldApi from '@/api/gen/tableField'


    export default {
        name: "update",
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
                    'max-height': '800px',
                    'overflow': 'auto'
                },
                pagination: false,
                columns: [
                    {
                        title: '#',
                        dataIndex: 'sort',
                    },
                    {
                        title: '字段名',
                        dataIndex: 'columnName',
                    },
                    {
                        title: '属性名',
                        dataIndex: 'attrName',
                    },
                    {
                        title: '属性类型',
                        dataIndex: 'attrType',
                    },
                    {
                        title: '字段说明',
                        dataIndex: 'columnComment',
                    },
                    {
                        title: '列表',
                        dataIndex: 'list',
                        scopedSlots: {customRender: 'list'},
                    },
                    {
                        title: '查询',
                        dataIndex: 'query',
                        scopedSlots: {customRender: 'query'},
                    },
                    {
                        title: '查询方式',
                        dataIndex: 'queryType',
                        scopedSlots: {customRender: 'queryType'},
                    },
                    {
                        title: '表单',
                        dataIndex: 'form',
                        scopedSlots: {customRender: 'form'},
                    },
                    {
                        title: '必填',
                        dataIndex: 'required',
                        scopedSlots: {customRender: 'required'},
                    },
                    {
                        title: '表单类型',
                        dataIndex: 'formType',
                        scopedSlots: {customRender: 'formType'},
                    },
                ],
                dataSource: [],
            }
        },
        methods: {
            /**
             *数据初始化
             */
            init(id) {
                this.formId = id || 0
                tableFieldApi.list(this.formId).then((response) => {
                    this.visible = true
                    this.confirmLoading = false
                    this.dataSource = response.data.data
                })
            },


            /**
             * 确认按钮
             */
            handleSubmit(e) {
                e.preventDefault()
                this.onFormSubmit(this.dataSource)
            },
            /**
             * 提交到后端api
             */
            onFormSubmit(values) {
                tableFieldApi.batchUpdate(values).then((result) => {
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
