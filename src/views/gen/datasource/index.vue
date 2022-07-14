<template>
    <a-card>

        <!--查询 start-->
        <div class="table-operator">
            <!-- 搜索板块 -->
            <a-row class="row-item-search">
                <a-form class="search-form" :form="searchFrom" layout="inline">

                    <a-form-item label="连接名" refs="searchFromRefs">
                        <a-input placeholder="连接名" v-decorator="['connName',{initialValue:''}]"/>
                    </a-form-item>

                    <a-form-item label="数据库类型">
                        <a-select v-decorator="['dbType',{initialValue:''}]">
                            <a-select-option value="">
                                全部
                            </a-select-option>
                            <a-select-option value="MySQL">
                                MySQL
                            </a-select-option>
                            <a-select-option value="Oracle">
                                Oracle
                            </a-select-option>
                            <a-select-option value="PostgreSQL">
                                PostgreSQL
                            </a-select-option>
                        </a-select>
                    </a-form-item>

                    <a-form-item>
                        <a-button icon="search" @click="init('search')" type="primary"
                                  :loading="searchButtonLoading">查询
                        </a-button>
                        <a-button icon="undo"
                                  @click="resetSearch"
                                  :loading="resetButtonLoading"
                                  style="margin-left: 8px">重置
                        </a-button>
                    </a-form-item>
                </a-form>
            </a-row>
        </div>
        <!--查询 end-->

        <!--表格 start-->
        <div>
            <!--头部菜单 start-->
            <a-space class="operator">
                <a-button icon="form" type="primary" @click="addOrUpdateHandle()">新增</a-button>
                <a-button icon="delete" type="danger" @click="handleDelete()">批量删除</a-button>
            </a-space>


            <!--头部菜单 end-->
            <a-table
                    row-key="id"
                    :columns="columns"

                    :pagination="pagination"
                    @change="onChange"
                    :loading="initLoading"
                    :data-source="dataSource"
                    :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            >
             <span slot="status" slot-scope="text, record">
              <a-tag v-if="record.status === 0">禁用</a-tag>
              <a-tag v-else color="#87d068">
                正常
              </a-tag>
             </span>>

                <span slot="action" slot-scope="text, record">
                  <a-button style="background-color: #108ee9;border-color:#108ee9" icon="edit"
                            class="operating-button-distance"
                            type="primary"
                            size="small" @click="addOrUpdateHandle(record.id)">编辑
                  </a-button>

                <a-button
                        class="operating-button-distance"
                        style=" color: #fff; background-color: #e6a23c; border-color: #e6a23c;"
                        icon="api"
                        size="small" @click="testConnHandle(record.id)">测试连接
                  </a-button>

                  <a-button size="small" type="danger" icon="delete" class="operating-button-distance"
                            @click="handleDelete(record.id)">
                    删除
                  </a-button>
            </span>
            </a-table>

        </div>
        <!--表格end-->
        <add-or-update @handleSubmit="init" ref="addOrUpdate"></add-or-update>
    </a-card>
</template>

<script>
    import * as Api from '@/api/gen/datasource'
    import AddOrUpdate from "./modules/add-or-update";

    export default {
        components: {AddOrUpdate},
        name: "index",
        data() {
            return {
                ids: [],
                visible: true,
                searchButtonLoading: false,
                resetButtonLoading: false,
                initLoading: true,
                searchFrom: this.$form.createForm(this),
                pagination: {
                    total: 0,
                    pageSize: 0,
                    showTotal: total => `共 ${total} 条数据`,
                },
                columns: [
                    {
                        title: 'ID',
                        dataIndex: 'id',
                    },
                    {
                        title: '连接名',
                        dataIndex: 'connName',
                    },
                    {
                        title: '数据库类型',
                        dataIndex: 'dbType',
                    },
                    {
                        title: '数据库URL',
                        dataIndex: 'connUrl',
                        width: '200px',
                    },
                    {
                        title: '用户名',
                        dataIndex: 'username',
                    },
                    {
                        title: '密码',
                        dataIndex: 'password',
                    },
                    {
                        title: '创建时间',
                        dataIndex: 'createTime',
                    },
                    {
                        title: '操作',
                        scopedSlots: {customRender: 'action'},
                        width: '230px',
                        align: 'center'
                    }
                ],
                dataSource: [],
                selectedRowKeys: [],
                currentPage: 1
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            /**
             *初始化数据
             */
            init(type = "") {
                this.buttonLoading(type, true)
                let searchParam = [
                    {column: 'conn_name', type: 'like', value: this.searchFrom.getFieldValue('connName')},
                    {column: 'db_type', type: 'eq', value: this.searchFrom.getFieldValue('dbType')},
                ]

                Api.page({
                    currentPage: this.currentPage,
                    fields: searchParam,
                    limit: 10,
                    orderField: "id",
                    asc: false
                }).then(response => {
                    const {data} = response.data
                    this.dataSource = data.records
                    this.pagination.pageSize = data.size
                    this.pagination.total = data.total
                    this.initLoading = false
                    this.buttonLoading(type, false)
                })
            },
            /**
             *新增 - 修改
             */
            addOrUpdateHandle(id) {
                this.$nextTick(() => {
                    this.$refs.addOrUpdate.init(id)
                })
            },

            /**
             * @param id
             * 测试连接
             */
            testConnHandle(id) {
                Api.test(id).then((result) => {
                    this.$message.success(result.data.message, 1.5)
                })
            },

            /**
             * 删除记录
             */
            handleDelete(id) {
                const app = this
                let deleteIds = [];
                if (id) {
                    deleteIds = [id]
                } else {
                    //批量删除
                    if (app.ids.length === 0) {
                        app.$message.error('请选择需要删除的数据', 1.5)
                        return
                    }
                    deleteIds = app.ids
                }

                const modal = this.$confirm({
                    title: '您确定要删除该记录吗?',
                    content: '删除后不可恢复',
                    onOk() {
                        Api.remove(deleteIds)
                            .then((result) => {
                                app.$message.success(result.data.message, 1.5)
                                app.resetSearch()
                            }).catch(() => {
                            modal.destroy()
                        })
                    }
                })
            },

            /**
             * 按钮的loading状态
             * @param type
             * @param status
             */
            buttonLoading(type, status) {
                if (type === "search") {
                    this.searchButtonLoading = status
                }
                if (type === "reset") {
                    this.resetButtonLoading = status
                }
                this.initLoading = status
            },

            /**
             * 重置搜索表单
             */
            resetSearch() {
                this.searchFrom.resetFields();
                this.init("reset")
            },
            /**
             * 分页处理
             * @param selectedRowKeys
             */
            onChange(selectedRowKeys) {
                this.currentPage = selectedRowKeys.current
                this.init()
            },
            /**
             * select 动作
             * @param row
             */
            onSelectChange(row) {
                this.selectedRowKeys = row;
                this.ids = row
            }
        }
    }
</script>

<style scoped>

</style>
