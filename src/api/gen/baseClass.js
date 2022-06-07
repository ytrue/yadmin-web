import {request, METHOD} from '@/utils/request1'


const apiPath = '/gen/baseClass'

/**
 * 获得列表数据
 * @returns {Promise<*>}
 */
export function page(data) {
    return request(`${apiPath}/page`, METHOD.POST, data)
}


/**
 * 新增或者編輯
 * @param params
 * @returns {*}
 */
export function saveAndUpdate(params) {
    let method = params.id ? METHOD.PUT : METHOD.POST
    return request(apiPath, method, params)
}
