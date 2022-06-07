<template>
    <a-card>

        <!--查询 start-->
        <div class="table-operator">
            <!-- 搜索板块 -->
            <a-row class="row-item-search">
                <a-form class="search-form" :form="searchFrom" layout="inline">

                    <a-form-item label="基类编码" refs="searchFromRefs">
                        <a-input placeholder="请输入基类编码" v-decorator="['username']"/>
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
                <a-button icon="delete" type="danger">批量删除</a-button>
            </a-space>


            <!--头部菜单 end-->
            <a-table
                    row-key="userId"
                    :columns="columns"
                    :dataSource="dataSource"
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
              <a-button style="background-color: #108ee9;border-color:#108ee9" icon="edit" type="primary"
                        size="small" @click="addOrUpdateHandle(record.userId)">编辑
              </a-button>
              <a-button size="small" type="danger" icon="delete" style="margin-left: 8px">
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
    import * as Api from '@/api/gen/baseClass'
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
                        title: '基类编码',
                        dataIndex: 'code',
                    },
                    {
                        title: '基类包名',
                        dataIndex: 'packageName',
                    },
                    {
                        title: '基类字段',
                        dataIndex: 'fields',
                    },
                    {
                        title: '备注',
                        dataIndex: 'remark',
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
                // this.buttonLoading(type, true)
                // let username = this.searchFrom.getFieldValue('username')
                //
                // let searchParam = [
                //     {column: 'username', type: 'like', value: username ? username : ""}
                // ]
                //

                Api.page({
                    currentPage: this.currentPage,
                    fields: [],
                    limit: 10
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
