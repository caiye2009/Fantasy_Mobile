import { get, post, put, del } from '@/utils/request'

// 用户相关接口
export const userApi = {
  // 登录
  login: (data) => post('/user/login', data),
  
  // 获取用户信息
  getUserInfo: () => get('/user/info'),
  
  // 更新用户信息
  updateUserInfo: (data) => put('/user/info', data),
  
  // 退出登录
  logout: () => post('/user/logout')
}

// 产品相关接口
export const productApi = {
  // 产品列表
  getList: (params) => get('/product/list', params),
  
  // 产品详情
  getDetail: (id) => get(`/product/detail/${id}`),
  
  // 创建产品
  create: (data) => post('/product/create', data),
  
  // 删除产品
  delete: (id) => del(`/product/delete/${id}`)
}

// 订单相关接口
export const orderApi = {
  // 订单列表
  getList: (params) => get('/order/list', params),
  
  // 创建订单
  create: (data) => post('/order/create', data),
  
  // 取消订单
  cancel: (id) => put(`/order/cancel/${id}`)
}