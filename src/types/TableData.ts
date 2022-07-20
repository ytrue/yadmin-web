/**
 * 过滤条件
 */
export interface FieldCondition {
    column: string,
    type: string,
    value: number | string
}

/**
 * 搜索参数
 */
export interface ISearchParam {
    fields: Array<FieldCondition>,
    currentPage: number,
    limit: number,
    orderField?: string
    asc?: boolean
}

/**
 * 分页参数
 */
export interface IPagination {
    total: number;
    pageNum: number;
    pageSize: number;
}

/**
 * 表格数据
 */
export interface ITableData<T> {
    data: Array<T>;
    loading: boolean;
    searchParam: Array<ISearchParam>,
    pagination: IPagination;
}

/**
 * 默认表格数据
 */
export class TableData<T> {
    tableData: ITableData<T> = {
        data: [],
        loading: false,
        searchParam: [],
        pagination: {
            total: 0,
            pageNum: 1,
            pageSize: 10,
        },
    }
}