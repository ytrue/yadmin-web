import {request, METHOD} from '@/utils/request1'


const apiPath = '/gen/baseClass'

/**
 * 获得列表数据
 * @returns {Promise<*>}
 */
export function page(data) {
    return request(`${apiPath}/page`, METHOD.POST, data)
}
