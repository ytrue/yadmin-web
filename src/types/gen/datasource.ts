// 列表数据
export interface IDatasourceDataTable {
    id: number;
    connName: string,
    dbType: string;
    connUrl: string;
    username: string;
    password: string;
    createTime: string;
}


// 列表搜索数据
export interface IDatasourceSearchFrom {
    connName: string
    dbType: string
}

// 新增和修改表单数据
export interface IDatasourceDataForm {
    id?: number ,
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