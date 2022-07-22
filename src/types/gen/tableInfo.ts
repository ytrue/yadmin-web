// 列表数据
export interface ITableInfoDataTable {
    id: number;
    tableName: string,
    tableComment: string;
    className: string;
    createTime: string;
}

// 列表搜索数据
export interface ITableInfoSearchFrom {
    tableName: string
}

// 生成代码表单数据
export interface ITableInfoDataForm {
    id: number,
    tableName: string,
    tableComment: string,
    className: string,
    baseclassId?: number | null,
    moduleName?: string | null,
    subModuleName?: string | null,
    packageName: string,
    version?: string | null,
    author: string,
    email?: string | null,
    backendPath: string,
    frontendPath: string,
}


// 新增数据
export interface IImportTableData {
    datasourceId: number | null,
    tableName: string | null
}


export class TableInfoDataForm implements ITableInfoDataForm {
    author = ''
    backendPath = ''
    className = ''
    frontendPath = ''
    id = 0
    packageName = ''
    tableComment = ''
    tableName = ''
}

export class ImportTableData implements IImportTableData {
    datasourceId = null
    tableName = null
}
