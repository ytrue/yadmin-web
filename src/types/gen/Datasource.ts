export interface IDatasourceDataTable {
    id: number;
    connName: string,
    dbType: string;
    connUrl: string;
    username: string;
    password: string;
    createTime: string;
}


// 搜索
export interface IDatasourceSearchFrom {
    connName: string
    dbType: string
}


export interface IDatasourceDataForm {
    id?: number | null,
    connName: string,
    dbType: string,
    connUrl: string,
    username: string,
    password: string,
}


export class DatasourceDataForm implements IDatasourceDataForm {
    connName = ''
    dbType = ''
    connUrl = ''
    username = ''
    password = ''
}