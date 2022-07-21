import request from '/@/utils/request';
import {RequestMethod} from "/@/enums/RequestMethod";
import {ISearchParam} from "/@/types/TableData";
import {IDatasourceDataForm} from "/@/types/gen/Datasource";

const apiPath: string = 'http://127.0.0.1:7000/gen/datasource'


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
 * 新增或者編輯
 * @param params
 */
export function saveAndUpdate(params: IDatasourceDataForm): any {
    return request({
        url: `${apiPath}`,
        method: params.id ? RequestMethod.PUT : RequestMethod.POST,
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
 * 测试连接
 * @param id
 */
export function test(id: number): any {
    return request({
        url: `${apiPath}/test/${id}`,
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


