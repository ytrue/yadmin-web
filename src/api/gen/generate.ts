import request from '/@/utils/request';
import {RequestMethod} from "/@/enums/RequestMethod";
import {ITableInfoDataForm} from "/@/types/gen/tableInfo";

const apiPath: string = 'http://127.0.0.1:7000/gen/generator'


/**
 * 代码生成
 * @param params
 */
export function code(params: ITableInfoDataForm): any {
    return request({
        url: `${apiPath}/code`,
        method: RequestMethod.POST,
        data: params,
    })
}