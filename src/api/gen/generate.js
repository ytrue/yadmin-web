import {METHOD, request} from '@/utils/request1'


const apiPath = '/gen/generator'

/**
 * 生成代码
 * @param params
 * @returns {*}
 */
export function code(params) {
    return request(`${apiPath}/code`, METHOD.POST, params)
}
