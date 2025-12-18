<template>
  <view class="page-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="nav-left">
        <u-avatar 
          :src="userInfo.avatar" 
          size="48"
          shape="circle"
          class="avatar"
        ></u-avatar>
        <view class="user-info">
          <view class="greeting">下午好</view>
          <view class="username">{{ userInfo.name }}</view>
        </view>
      </view>
      <view class="nav-right">
        <u-icon 
          name="bell" 
          size="24" 
          color="#333" 
          class="nav-icon"
          @click="handleNotification"
        ></u-icon>
        <u-icon 
          name="search" 
          size="24" 
          color="#333" 
          class="nav-icon"
          @click="handleSearch"
        ></u-icon>
      </view>
    </view>

    <!-- 主体内容 -->
    <scroll-view 
      scroll-y 
      class="scroll-container"
      refresher-enabled
      :refresher-triggered="refreshing"
      @refresherrefresh="onRefresh"
    >
      <!-- 欢迎卡片 -->
      <view class="welcome-card">
        <view class="welcome-content">
          <view class="welcome-title">探索更多功能</view>
          <view class="welcome-desc">发现为您准备的精彩内容</view>
        </view>
        <view class="welcome-bg">
          <image 
            src="https://cdn.uviewui.com/uview/common/logo.png" 
            mode="aspectFit"
            class="bg-image"
          ></image>
        </view>
      </view>

      <!-- 功能标题 -->
      <view class="section-title">
        <view class="title-line"></view>
        <view class="title-text">快捷入口</view>
        <view class="title-line"></view>
      </view>

      <!-- 六宫格区域 -->
      <view class="grid-container">
        <view 
          v-for="(item, index) in gridList" 
          :key="item.id"
          class="grid-item"
          :class="{ 'active': activeIndex === index }"
          :style="getGridStyle(index)"
          @touchstart="handleTouchStart(index)"
          @touchend="handleTouchEnd(index)"
          @click="handleGridClick(item)"
        >
          <!-- 立体装饰边框 -->
          <view class="grid-border"></view>
          
          <!-- 内容区域 -->
          <view class="grid-content">
            <!-- 图标 -->
            <view 
              class="grid-icon-wrapper"
              :style="{ background: item.iconBg }"
            >
              <u-icon 
                :name="item.icon" 
                :color="item.iconColor" 
                size="28"
              ></u-icon>
            </view>  
            
            <!-- 标题 -->
            <view class="grid-title">{{ item.title }}</view>
            
            <!-- 描述 -->
            <view class="grid-desc">{{ item.desc }}</view>
            
            <!-- 角标 -->
            <view 
              v-if="item.badge" 
              class="grid-badge"
              :style="{ background: item.iconColor }"
            >
              {{ item.badge }}
            </view>
          </view>
          
          <!-- 点击效果遮罩 -->
          <view class="grid-mask"></view>
        </view>
      </view>

      <!-- 底部提示 -->
      <view class="hint-section">
        <u-icon 
          name="info-circle" 
          size="18" 
          color="#666" 
          class="hint-icon"
        ></u-icon>
        <text class="hint-text">点击图标快速进入功能页面</text>
      </view>

      <!-- 空白区域 -->
      <view class="bottom-space"></view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import "./index.scss"
// 响应式数据
const userInfo = ref({
  name: '用户',
  avatar: 'https://cdn.uviewui.com/uview/swiper/1.jpg'
})

const activeIndex = ref(-1)
const refreshing = ref(false)

// 六宫格数据
const gridList = ref([
  { 
    id: 1, 
    title: '订单管理', 
    desc: '查看所有订单', 
    icon: 'order', 
    iconColor: '#409EFF',
    iconBg: 'rgba(64, 158, 255, 0.1)',
    bgColor: '#FFFFFF',
    shadowColor: 'rgba(64, 158, 255, 0.2)',
    path: '/pages/order/list/index',
    badge: '3'
  },
  { 
    id: 2, 
    title: '商品中心', 
    desc: '浏览商品', 
    icon: 'shopping-cart', 
    iconColor: '#67C23A',
    iconBg: 'rgba(103, 194, 58, 0.1)',
    bgColor: '#FFFFFF',
    shadowColor: 'rgba(103, 194, 58, 0.2)',
    path: '/pages/material/list/index'
  },
  { 
    id: 3, 
    title: '消息通知', 
    desc: '查看消息', 
    icon: 'chat', 
    iconColor: '#E6A23C',
    iconBg: 'rgba(230, 162, 60, 0.1)',
    bgColor: '#FFFFFF',
    shadowColor: 'rgba(230, 162, 60, 0.2)',
    path: '/pages/message/index',
    badge: '12'
  },
  { 
    id: 4, 
    title: '我的收藏', 
    desc: '收藏夹', 
    icon: 'star', 
    iconColor: '#F56C6C',
    iconBg: 'rgba(245, 108, 108, 0.1)',
    bgColor: '#FFFFFF',
    shadowColor: 'rgba(245, 108, 108, 0.2)',
    path: '/pages/favorite/index'
  },
  { 
    id: 5, 
    title: '会员中心', 
    desc: '尊享权益', 
    icon: 'level', 
    iconColor: '#909399',
    iconBg: 'rgba(144, 147, 153, 0.1)',
    bgColor: '#FFFFFF',
    shadowColor: 'rgba(144, 147, 153, 0.2)',
    path: '/pages/vip/index'
  },
  { 
    id: 6, 
    title: '系统设置', 
    desc: '应用设置', 
    icon: 'setting', 
    iconColor: '#409EFF',
    iconBg: 'rgba(64, 158, 255, 0.1)',
    bgColor: '#FFFFFF',
    shadowColor: 'rgba(64, 158, 255, 0.2)',
    path: '/pages/settings/index'
  }
])

// 计算属性 - 为每个宫格生成3D变换
const getGridStyle = (index) => {
  const baseTransform = 'perspective(1000px)'
  const hoverTransform = activeIndex.value === index 
    ? 'translateZ(20px) scale(1.05)' 
    : 'translateZ(0px)'
  
  return {
    transform: `${baseTransform} ${hoverTransform}`,
    background: gridList.value[index].bgColor,
    boxShadow: activeIndex.value === index 
      ? `0 20px 40px ${gridList.value[index].shadowColor}, 0 10px 20px rgba(0,0,0,0.1)`
      : `0 10px 20px ${gridList.value[index].shadowColor}, 0 5px 10px rgba(0,0,0,0.05)`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: `1px solid ${gridList.value[index].iconColor}20`
  }
}

// 处理触摸开始
const handleTouchStart = (index) => {
  activeIndex.value = index
}

// 处理触摸结束
const handleTouchEnd = (index) => {
  setTimeout(() => {
    activeIndex.value = -1
  }, 150)
}

// 处理宫格点击
const handleGridClick = (item) => {
  uni.showLoading({ title: '加载中...' })
  
  setTimeout(() => {
    uni.hideLoading()
    uni.showToast({
      title: `进入${item.title}`,
      icon: 'success',
      duration: 1500
    })
    console.log(item.path) 
    // 跳转到对应页面
    uni.navigateTo({ url: item.path })
  }, 500)
}

// 处理通知点击
const handleNotification = () => {
  uni.showToast({
    title: '消息通知',
    icon: 'none'
  })
}

// 处理搜索点击
const handleSearch = () => {
  uni.showToast({
    title: '搜索功能',
    icon: 'none'
  })
}

// 下拉刷新
const onRefresh = () => {
  refreshing.value = true
  
  setTimeout(() => {
    refreshing.value = false
    uni.showToast({
      title: '刷新成功',
      icon: 'success'
    })
  }, 1500)
}

// 页面加载
onLoad(() => {
  console.log('首页加载完成')
})

// 页面挂载
onMounted(() => {
  // 可以在这里进行数据初始化 
})
</script>


