import request from '/@/utils/request';
import {RequestMethod} from "/@/enums/RequestMethod";
import {ITableInfoDataForm} from "/@/types/gen/tableInfo";

const apiPath: string = 'gen/generator'


/**
 * ไปฃ็ ็ๆ
 * @param params
 */
export function code(params: ITableInfoDataForm): any {
    return request({
        url: `${apiPath}/code`,
        method: RequestMethod.POST,
        data: params,
    })
}
