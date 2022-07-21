export interface IBaseClassDataTable {
    id: number;
    packageName: string,
    code: string;
    fields: string;
    remark: string;
    createTime: string;
    updateTime: string;
}

export interface IBaseClassDataForm {
    id?: number | null,
    code: string,
    packageName: string,
    fields: string,
    remark?: string | null,
}


export class BaseClassDataForm implements IBaseClassDataForm {
    code = ''
    fields = ''
    packageName = ''
}