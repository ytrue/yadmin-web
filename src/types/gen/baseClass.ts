// 列表数据
export interface IBaseClassDataTable {
    id: number;
    packageName: string,
    code: string;
    fields: string;
    remark: string;
    createTime: string;
}

// 新增和修改表单数据
export interface IBaseClassDataForm {
    id?: number | null,
    code: string | null,
    packageName: string | null,
    fields: string | null,
    remark?: string | null,
}

export class BaseClassDataForm implements IBaseClassDataForm {
    code = null
    fields = null
    packageName = null
}