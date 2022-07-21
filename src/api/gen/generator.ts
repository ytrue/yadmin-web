import request from '/@/utils/request';
import {RequestMethod} from "/@/enums/RequestMethod";
import {ISearchParam} from "/@/types/TableData";

const tableInfoApiPath: string = 'http://127.0.0.1:7000/gen/tableInfo'


/**
 * 列表获取
 * @param params
 */
export function page(params: ISearchParam): any {
    return request({
        url: `${tableInfoApiPath}/page`,
        method: RequestMethod.POST,
        data: params,
    })
}


/**
 * 删除
 * @param ids
 */
export function remove(ids: Array<number>): any {

    return request({
        url: `${tableInfoApiPath}`,
        method: RequestMethod.DELETE,
        data: ids,
    })
}
