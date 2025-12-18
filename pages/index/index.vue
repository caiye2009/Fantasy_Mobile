<template>
  <view class="container">
    <view class="content">
      <image class="logo" src="/static/logo.png" mode="aspectFit"></image>
      
      <view class="text-area">
        <text class="title">{{ appTitle }}</text>
        <u-button 
          class="auth-btn"
          type="primary" 
          size="large" 
          shape="square"  
          :loading="loading"
          :disabled="loading"
          @click="handleAuthLogin"
        >
          {{ loading ? '授权中...' : '授权登录' }}
        </u-button>
      </view>
    </view>
    
    <view class="footer" v-if="showFooter">
      <text class="footer-text">版本 {{ version }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// 响应式数据
const appTitle = ref('凡特思')
const loading = ref(false)
const showFooter = ref(true)
const version = ref('1.0.0')

// 页面加载检查登录状态
onLoad(() => {
  const token = uni.getStorageSync('token')
  if (token) uni.navigateTo({ url: '/pages/order/index/index' })
})

// 授权登录处理 
const handleAuthLogin = async () => {
  if (loading.value) return
  try {
    loading.value = true
    // const userInfoRes = await uni.getUserProfile({ desc: '用于完善会员资料' })
    // const loginRes = await uni.login()
    // uni.setStorageSync('token', 'mock_token_123456')
    // uni.setStorageSync('userInfo', userInfoRes.userInfo)
    uni.showToast({ title: '授权成功', icon: 'success', duration: 1500 })
    setTimeout(() => uni.navigateTo({ url: '/pages/order/index/index' }), 1500)
  } catch (error) {
    uni.showToast({ 
      title: error.errMsg || '授权失败，请重试', 
      icon: 'error', 
      duration: 2000 
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
page {
  height: 100%;
  position: relative;
}

.container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
  overflow: hidden;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 40rpx;
  position: relative;
  z-index: 1;
}

.logo {
  width: 180rpx;
  height: 180rpx;
  margin-bottom: 50rpx;
  border-radius: 20rpx;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.2);
  background: rgba(255, 255, 255, 0.1);
  padding: 20rpx;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0) rotate(0deg); box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.3); }
  50% { transform: translateY(-20rpx) rotate(1deg); box-shadow: 0 40rpx 80rpx rgba(0, 0, 0, 0.4); }
  100% { transform: translateY(0) rotate(0deg); box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.3); }
}

.text-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600rpx;
}

.title {
  font-size: 42rpx;
  font-weight: 600;
  color: #fff; /* 白色文字 */
  margin-bottom: 60rpx;
  text-align: center;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
}

/* 新按钮样式：半透明蓝紫渐变背景+白色文字 */
.auth-btn {
  width: 100%;
  max-width: 400rpx;
  height: 88rpx;
  border-radius: 12rpx;
  margin-top: 10rpx;
  font-size: 32rpx;
  font-weight: 500;
  color: #fff !important; /* 白色文字 */
  border: none;
  transition: all 0.2s ease;
}

/* 按钮点击态反馈 */
.auth-btn:active {
  transform: scale(0.98);
  opacity: 0.9; /* 点击时略微透明 */
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.2); /* 减弱阴影 */
}

.footer {
  padding: 20rpx 0;
  display: flex;
  justify-content: center;
}

.footer-text {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.7);
}
</style>