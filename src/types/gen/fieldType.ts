// 列表数据
export interface IFieldTypeDataTable {
    id: number;
    columnType: string,
    attrType: string;
    packageName: string;
    createTime: string;
}


// 列表搜索数据
export interface IFieldTypeSearchFrom {
    attrType: string
    columnType: string
}

// 新增和修改表单数据
export interface IFieldTypeDataForm {
    id?: number | null,
    columnType: string | null,
    attrType: string | null,
    packageName?: string | null,
}


export class FieldTypeDataForm implements IFieldTypeDataForm {
    columnType = null
    attrType = null
}