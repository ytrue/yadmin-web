export interface IFieldTypeDataTable {
    id: number;
    columnType: string,
    attrType: string;
    packageName: string;
    createTime: string;
}


// 搜索
export interface IFieldTypeSearchFrom {
    attrType: string
    columnType: string
}


export interface IFieldTypeDataForm {
    id?: number | null,
    columnType: string,
    attrType: string,
    packageName?: string | null,
}


export class FieldTypeDataForm implements IFieldTypeDataForm {
    columnType = ''
    attrType = ''
}