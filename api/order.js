// api/order.js
import request from '@/utils/request'

// 获取巡检任务列表
export function getorderList(params) {
  return request({
    url: '/api/order/tasks',
    method: 'GET',
    params: {
      pageNum: params.pageNum || 1,
      pageSize: params.pageSize || 10,
      status: params.status, // 状态筛选
      keyword: params.keyword, // 关键词搜索
      tab: params.tab // 标签页类型
    }
  })
}

// 获取任务详情
export function getorderDetail(id) {
  return request({
    url: `/api/order/tasks/${id}`,
    method: 'GET'
  })
}

// 开始巡检
export function startorder(data) {
  return request({
    url: '/api/order/start',
    method: 'POST',
    data
  })
}

// 完成巡检
export function completeorder(data) {
  return request({
    url: '/api/order/complete',
    method: 'POST',
    data
  })
}

// 扫码绑定设备
export function scanDevice(code) {
  return request({
    url: '/api/device/scan',
    method: 'POST',
    data: { qrCode: code }
  })
}

// 导出任务数据
export function exportTasks(params) {
  return request({
    url: '/api/order/export',
    method: 'GET',
    params,
    responseType: 'blob'
  })
}