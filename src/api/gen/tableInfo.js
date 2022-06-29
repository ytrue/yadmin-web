import {request, METHOD} from '@/utils/request1'


const apiPath = '/gen/tableInfo'

/**
 * 获得列表数据
 * @returns {Promise<*>}
 */
export function page(data) {
    return request(`${apiPath}/page`, METHOD.POST, data)
}


/**
 * 指定id获取所以的数据表
 * @param id
 * @returns {*}
 */
export function list(id) {
    return request(`${apiPath}/list/${id}`, METHOD.GET)
}


/**
 * 导入数据表
 * @returns {Promise<*>}
 */
export function importTable(data) {
    return request(`${apiPath}/import`, METHOD.POST, data)
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
 * 删除
 * @param ids
 * @returns {*}
 */
export function remove(ids) {
    return request(apiPath, METHOD.DELETE, ids)
}


/**
 * 获得信息
 * @param id
 * @returns {*}
 */
export function detail(id) {
    return request(`${apiPath}/detail/${id}`, METHOD.GET)
}

