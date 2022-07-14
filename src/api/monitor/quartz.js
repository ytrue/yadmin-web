import {METHOD, request} from '@/utils/request1'

const apiPath = '/sys/schedule'

/**
 * 获得列表数据
 * @returns {Promise<*>}
 */
export async function page(data) {
    return request(`${apiPath}/page`, METHOD.POST, data)
}

/**
 * 新增或者編輯
 * @param params
 * @returns {*}
 */
export function saveAndUpdate(params) {
    let method = params.jobId ? METHOD.PUT : METHOD.POST
    return request(apiPath, method, params)
}


/**
 * 立即执行任务
 * @param data
 * @returns {Promise<*>}
 */
export async function runTask(data) {
    return request(`${apiPath}/run`, METHOD.POST, data)
}

/**
 * 暂停定时任务
 * @param data
 * @returns {Promise<*>}
 */
export async function pause(data) {
    return request(`${apiPath}/pause`, METHOD.POST, data)
}

/**
 * 恢复定时任务
 * @param data
 * @returns {Promise<*>}
 */
export async function resume(data) {
    return request(`${apiPath}/resume`, METHOD.POST, data)
}


/**
 * 日志分页
 * @param data
 * @returns {Promise<*>}
 */
export async function logPage(data) {
    return request('/sys/scheduleLog/page', METHOD.POST, data)
}


/**
 * 删除
 * @param data
 * @returns {*}
 */
export function remove(data) {
    return request(apiPath, METHOD.DELETE, data)
}


/**
 * 获得信息
 * @param id
 * @returns {*}
 */
export function info(id) {
    return request(`${apiPath}/${id}/info`, METHOD.GET)
}

