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
