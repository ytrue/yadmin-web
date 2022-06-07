import {request, METHOD} from '@/utils/request1'


const apiPath = '/gen/fieldType'

/**
 * 获得列表数据
 * @returns {Promise<*>}
 */
export function page(data) {
    return request(`${apiPath}/page`, METHOD.POST, data)
}


/**
 * 获得所以数据
 * @returns {Promise<*>}
 */
export function list() {
    return request(`${apiPath}/list`, METHOD.GET)
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


/**
 * 获得信息
 * @param id
 * @returns {*}
 */
export function detail(id) {
    return request(`${apiPath}/${id}`, METHOD.GET)
}


/**
 * 删除
 * @param ids
 * @returns {*}
 */
export function remove(ids) {
    return request(apiPath, METHOD.DELETE, ids)
}
