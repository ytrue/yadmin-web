import {METHOD, request} from '@/utils/request1'


const apiPath = '/gen/tableField'

/**
 * 根据表id获取字段列表
 * @param id
 * @returns {*}
 */
export function list(id) {
    return request(`${apiPath}/list/${id}`, METHOD.GET)
}


/**
 * 修改
 * @param params
 * @returns {*}
 */
export function batchUpdate(params) {
    return request(`${apiPath}/batchUpdate`, METHOD.POST, params)
}
