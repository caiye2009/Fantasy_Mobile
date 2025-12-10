// 基础配置
const BASE_URL = 'https://api.example.com' // API地址
const TIMEOUT = 15000 // 超时时间

// 请求拦截器
const requestInterceptor = (config) => {
  // 可以在这里添加token、公共参数等
  const token = uni.getStorageSync('token')
  if (token) {
    config.header = {
      ...config.header,
      'Authorization': `Bearer ${token}`
    }
  }
  
  // 显示加载提示
  if (config.showLoading !== false) {
    uni.showLoading({
      title: '加载中...',
      mask: true
    })
  }
  
  return config
}

// 响应拦截器
const responseInterceptor = (response) => {
  // 隐藏加载提示
  uni.hideLoading()
  
  const { statusCode, data } = response
  
  if (statusCode === 200) {
    // 业务结构处理
    if (data.code === 0 || data.code === 200) {
      return data.data || data
    } else {
      // 业务错误
      uni.showToast({
        title: data.message || '请求失败',
        icon: 'none'
      })
      return Promise.reject(data)
    }
  } else {
    // HTTP错误
    uni.showToast({
      title: `请求错误: ${statusCode}`,
      icon: 'none'
    })
    return Promise.reject(response)
  }
}

// 错误处理
const errorHandler = (error) => {
  uni.hideLoading()
  
  if (error.errMsg && error.errMsg.includes('timeout')) {
    uni.showToast({
      title: '请求超时',
      icon: 'none'
    })
  } else if (error.errMsg && error.errMsg.includes('network')) {
    uni.showToast({
      title: '网络连接失败',
      icon: 'none'
    })
  } else {
    uni.showToast({
      title: error.message || '系统错误',
      icon: 'none'
    })
  }
  
  return Promise.reject(error)
}

// 主请求函数
export const request = (config) => {
  const mergedConfig = {
    url: config.url.startsWith('http') ? config.url : `${BASE_URL}${config.url}`,
    method: config.method || 'GET',
    data: config.data || {},
    header: {
      'Content-Type': 'application/json',
      ...config.header
    },
    timeout: config.timeout || TIMEOUT,
    ...config
  }
  
  // 执行请求拦截
  const finalConfig = requestInterceptor(mergedConfig)
  
  return new Promise((resolve, reject) => {
    uni.request({
      ...finalConfig,
      success: (res) => {
        try {
          const processedData = responseInterceptor(res)
          resolve(processedData)
        } catch (error) {
          reject(error)
        }
      },
      fail: (error) => {
        const processedError = errorHandler(error)
        reject(processedError)
      },
      complete: () => {
        if (finalConfig.showLoading !== false) {
          uni.hideLoading()
        }
      }
    })
  })
}

// 快捷方法
export const get = (url, data = {}, config = {}) => {
  return request({
    url,
    data,
    method: 'GET',
    ...config
  })
}

export const post = (url, data = {}, config = {}) => {
  return request({
    url,
    data,
    method: 'POST',
    ...config
  })
}

export const put = (url, data = {}, config = {}) => {
  return request({
    url,
    data,
    method: 'PUT',
    ...config
  })
}

export const del = (url, data = {}, config = {}) => {
  return request({
    url,
    data,
    method: 'DELETE',
    ...config
  })
}