import request from '/@/utils/request';
import {RequestMethod} from "/@/enums/RequestMethod";
import {ISearchParam} from "/@/types/tableData";
import {IImportTableData, ITableInfoDataForm} from "/@/types/gen/tableInfo";

const apiPath: string = 'gen/tableInfo'


/**
 * 列表获取
 * @param params
 */
export function page(params: ISearchParam): any {
    return request({
        url: `${apiPath}/page`,
        method: RequestMethod.POST,
        data: params,
    })
}

/**
 * 获得信息
 * @param id
 */
export function detail(id: number): any {
    return request({
        url: `${apiPath}/detail/${id}`,
        method: RequestMethod.GET,
    })
}


/**
 * 删除
 * @param ids
 */
export function remove(ids: Array<number>): any {

    return request({
        url: `${apiPath}`,
        method: RequestMethod.DELETE,
        data: ids,
    })
}

/**
 * 指定id获取所以的数据表
 * @param id
 */
export function list(id: number): any {
    return request({
        url: `${apiPath}/list/${id}`,
        method: RequestMethod.GET,
    })
}


/**
 * 导入数据表
 * @param params
 */
export function importTable(params: IImportTableData): any {
    return request({
        url: `${apiPath}/import`,
        method: RequestMethod.POST,
        data: params,
    })
}


/**
 * 新增或者編輯
 * @param params
 */
export function saveAndUpdate(params: ITableInfoDataForm): any {
    return request({
        url: `${apiPath}`,
        method: params.id ? RequestMethod.PUT : RequestMethod.POST,
        data: params,
    })
}
