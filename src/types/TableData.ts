/**
 * 过滤条件
 */

export interface FieldCondition {
    column: string,
    condition: string,
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
 * 搜索表单接口
 */
export interface ITableSearch<T> {
    searchFrom: T,
    searchParam: Array<ISearchParam>,
}

/**
 * 搜索表单需要的数据
 */
export class FromSearch<T> implements ITableSearch<T> {
    searchFrom: T;

    constructor(searchFrom: T) {
        this.searchFrom = searchFrom;
    }

    searchParam = new Array<ISearchParam>()
}


/**
 * 表格数据接口
 */
export interface ITable<T> {
    // 复选框选中的id值
    selectIds: Array<number>,
    data: Array<T>;
    loading: boolean;
    pagination: IPagination;
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
export class Table<T> implements ITable<T> {
    data = new Array<T>()
    loading = true
    pagination = {
        total: 0,
        pageNum: 1,
        pageSize: 10,
    }
    selectIds = new Array<number>();
}