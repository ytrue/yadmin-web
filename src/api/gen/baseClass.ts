import request from '/@/utils/request';
import {RequestMethod} from "/@/enums/RequestMethod";
import {ISearchParam} from "/@/types/TableData";

const apiPath: string = 'http://127.0.0.1:7000/gen/baseClass'


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