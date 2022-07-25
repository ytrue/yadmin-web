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
    id?: number,
    code: string,
    packageName: string,
    fields: string,
    remark?: string,
}

export class BaseClassDataForm implements IBaseClassDataForm {
    code = ''
    fields = ''
    packageName = ''
}