import request from '/@/utils/request';
import {RequestMethod} from "/@/enums/RequestMethod";
import {ITableFieldDataForm} from "/@/types/gen/tableField";

const apiPath: string = 'http://127.0.0.1:7000/gen/tableField'


/**
 * 代码生成
 * @param id
 */
export function list(id: number): any {
    return request({
        url: `${apiPath}/list/${id}`,
        method: RequestMethod.GET,
    })
}


/**
 * 修改
 * @param params
 */
export function batchUpdate(params: Array<ITableFieldDataForm>): any {
    return request({
        url: `${apiPath}/batchUpdate`,
        method: RequestMethod.POST,
        data: params,
    })
}
