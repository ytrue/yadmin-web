<template>
    <a-card>
        <!--查询 start-->
        <div class="table-operator">
            <!-- 搜索板块 -->
            <a-row class="row-item-search">
                <a-form class="search-form" :form="searchFrom" layout="inline">
                    <a-form-item label="bean名称" refs="searchFromRefs">
                        <a-input placeholder="请输入bean名称" v-decorator="['beanName']"/>
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
                <a-button icon="forward"
                          @click="pauseHandle()"
                          style=" color: #fff; background-color: #e6a23c; border-color: #e6a23c;">批量暂停
                </a-button>
                <a-button icon="pause"
                          @click="resumeHandle()"
                          style=" color: #fff; background-color: #67c23a; border-color: #67c23a;">批量恢复
                </a-button>
                <a-button icon="thunderbolt"
                          @click="runTaskHandle()"
                          style=" color: #fff; background-color: #409eff; border-color: #409eff;">批量立即执行
                </a-button>
                <a-button icon="file-search"
                          @click="logHandle"
                          style=" color: #fff; background-color: #ffba00; border-color: #ffba00;">日志列表
                </a-button>
            </a-space>
            <!--头部菜单 end-->

            <a-table
                    row-key="id"
                    :columns="columns"
                    :dataSource="dataSource"
                    :pagination="pagination"
                    @change="onChange"
                    :loading="initLoading"
                    :data-source="dataSource"
                    :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            >
        <span slot="status" slot-scope="record">
          <a-tag v-if="record.status !== 0">暂停</a-tag>
          <a-tag v-else color="#87d068">
            正常
          </a-tag>
        </span>


                <span slot="action" slot-scope="text, record">
          <a-button
                  @click="addOrUpdateHandle(record.id)"
                  size="small"
                  style="background-color: #108ee9;border-color:#108ee9"
                  icon="edit"
                  type="primary"
          >编辑
          </a-button>
          <a-button
                  @click="handleDelete(record.id)"
                  type="danger"
                  size="small"
                  icon="delete"
                  style="margin-left: 8px"
          >删除
          </a-button>

          <a-button
                  :loading="pauseButtonLoading"
                  @click="pauseHandle(record.id)"
                  size="small" icon="forward"
                  style=" color: #fff; background-color: #e6a23c; border-color: #e6a23c;margin-top: 8px;">
            暂停
          </a-button>

          <a-button
                  @click="resumeHandle(record.id)"
                  size="small" icon="pause"
                  style=" color: #fff; background-color: #67c23a; border-color: #67c23a;margin-top: 8px;margin-left: 8px">
            恢复
          </a-button>

          <a-button
                  @click="runTaskHandle(record.id)"
                  size="small" icon="thunderbolt"
                  style=" color: #fff; background-color: #409eff; border-color: #409eff;margin-top: 8px;">
            立即执行
          </a-button>
        </span>
            </a-table>
        </div>

        <add-or-update
                @handleSubmit="resetSearch"
                ref="addOrUpdate"/>

        <!-- 弹窗, 日志列表 -->
        <schedule-log
                ref="scheduleLog"
        />

    </a-card>
</template>

<script>
    import AddOrUpdate from "./modules/add-or-update";
    import ScheduleLog from "./modules/schedule-log";
    import {page, pause, remove, resume, runTask} from '@/api/monitor/quartz'

    export default {
        components: {AddOrUpdate, ScheduleLog},
        name: "index",
        data() {
            return {
                //选中的id
                ids: [],
                //搜索加载
                searchButtonLoading: false,
                //重置加载
                resetButtonLoading: false,
                //初始话加载
                initLoading: true,
                //暂停
                pauseButtonLoading: false,
                //搜索表单
                searchFrom: this.$form.createForm(this),
                selectedRowKeys: [],
                pagination: {
                    total: 0,
                    pageSize: 0,
                    showTotal: total => `共 ${total} 条数据`,
                },
                //数据源
                dataSource: [],
                //表格
                columns: [
                    // {
                    //     title: '任务id',
                    //     dataIndex: 'jobId',
                    // },
                    {
                        title: 'bean名称',
                        dataIndex: 'beanName',
                    },
                    {
                        title: '方法名称',
                        dataIndex: 'methodName',
                    },
                    {
                        title: '参数',
                        dataIndex: 'params',
                    },
                    {
                        title: 'cron表达式',
                        dataIndex: 'cronExpression',
                    },
                    {
                        title: '备注',
                        dataIndex: 'remark',
                    },
                    {
                        title: '状态',
                        scopedSlots: {customRender: 'status'}
                    },
                    {
                        title: '操作',
                        scopedSlots: {customRender: 'action'},
                        width: '230px',
                        align: 'center'
                    }
                ]
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
                let beanName = this.searchFrom.getFieldValue('beanName')
                let searchParam = [
                    {column: 'bean_name', type: 'like', value: beanName ? beanName : ""}
                ]
                page({
                    currentPage: this.currentPage,
                    fields: searchParam,
                    limit: 5,
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
             *日志列表
             */
            logHandle() {
                this.$nextTick(() => {
                    this.$refs.scheduleLog.init()
                })
            },

            /**
             * add or update
             * @param id
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
             * @returns void
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
                        remove(deleteIds)
                            .then((result) => {
                                app.$message.success(result.data.message, 1.5)
                                app.ids=[]
                                app.resetSearch()
                            }).catch(() => {
                            modal.destroy()
                        })
                    }
                })
            },

            //暂停
            pauseHandle(id) {
                const app = this
                let ids = [];

                if (id) {
                    ids = [id]
                } else {
                    //批量删除
                    if (app.ids.length === 0) {
                        app.$message.error('请选择要操作的数据', 1.5)
                        return
                    }
                    ids = app.ids
                }

                this.$confirm({
                    title: '您确定要暂停选择吗?',
                    onOk() {
                        pause(ids).then((result) => {
                            app.$message.success(result.data.message, 1.5)
                            app.ids=[]
                            app.resetSearch()
                            app.selectedRowKeys = []
                        })
                    }
                })
            },


            //恢复
            resumeHandle(id) {
                const app = this
                let ids = [];

                if (id) {
                    ids = [id]
                } else {
                    //批量删除
                    if (app.ids.length === 0) {
                        app.$message.error('请选择要操作的数据', 1.5)
                        return
                    }
                    ids = app.ids
                }

                this.$confirm({
                    title: '您确定要恢复选择的记录吗?',
                    onOk() {
                        resume(ids).then((result) => {
                            app.$message.success(result.data.message, 1.5)
                            app.ids=[]
                            app.resetSearch()
                            app.selectedRowKeys = []
                        })
                    }
                })
            },

            //立即执行
            runTaskHandle(id) {
                const app = this
                let ids = [];

                if (id) {
                    ids = [id]
                } else {
                    //批量删除
                    if (app.ids.length === 0) {
                        app.$message.error('请选择要操作的数据', 1.5)
                        return
                    }
                    ids = app.ids
                }
                this.$confirm({
                    title: '请问是否要立即执行?',
                    onOk() {
                        runTask(ids).then((result) => {
                            app.$message.success(result.data.message, 1.5)
                        })
                    }
                })
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

<style lang="less" scoped>

</style>
