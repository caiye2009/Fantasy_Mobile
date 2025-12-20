<!-- pages/order/list/index.vue -->
<template>
  <view class="order-page">
    <!-- 搜索区域 -->
    <view class="search-box">
      <u-search
        v-model="searchKeyword"
        placeholder="关键词搜索, 如订单编号, 负责人"
        :showAction="false"
        shape="square"
        bgColor="#f5f5f5"
        @search="handleSearch"
        @clear="handleClearSearch"
      ></u-search>
    </view>

    <!-- 标签页 -->
    <u-tabs
      :list="tabList"
      :current="currentTab"
      @change="handleTabChange"
      :activeStyle="{
        color: '#2979ff',
        fontWeight: 'bold'
      }"
      :inactiveStyle="{
        color: '#666'
      }"
      :lineColor="'#2979ff'"
      :lineWidth="30"
      :lineHeight="3"
      itemStyle="padding-left: 15px; padding-right: 15px; height: 44px;"
    ></u-tabs>

    <!-- 订单列表 -->
    <scroll-view
      class="task-list"
      :refresher-enabled="true"
      :refresher-triggered="refreshing"
      @refresherrefresh="onRefresh"
      @scrolltolower="loadMore"
      scroll-y
    >
      <!-- 空状态 -->
      <u-empty
        v-if="taskList.length === 0 && !loading"
        mode="list"
        icon="http://cdn.uviewui.com/uview/empty/list.png"
        text="暂无巡检订单"
      >
        <template #bottom>
          <u-button
            type="primary"
            text="刷新"
            @click="fetchTaskList"
            size="mini"
            style="margin-top: 20rpx;"
          ></u-button>
        </template>
      </u-empty>

      <!-- 加载中 -->
      <view v-if="loading && taskList.length === 0" class="loading-container">
        <u-loading-icon text="加载中..." textSize="16" color="#2979ff"></u-loading-icon>
      </view>

      <!-- 订单卡片列表 -->
      <view v-else>
        <task-card
          v-for="(task, index) in taskList"
          :key="task.id || index"
          :task="task"
          @click="handleTaskClick(task)"
        />
      </view>

      <!-- 加载更多 -->
      <view v-if="loadingMore" class="load-more">
        <u-loading-icon text="加载中..." size="20" textSize="14" color="#999"></u-loading-icon>
      </view>

      <view v-if="noMore" class="no-more">没有更多了</view>
    </scroll-view>

    <!-- 底部扫一扫按钮 -->
    <view class="scan-button-container">
      <u-button
        type="primary"
        shape="circle"
        @click="handleScan"
        :customStyle="{
          height: '88rpx',
          fontSize: '32rpx',
          fontWeight: '500'
        }"
      >
        <u-icon name="scan" size="20" color="#fff" style="margin-right: 8rpx;"></u-icon>
        扫一扫
      </u-button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import TaskCard from '@/components/order_card.vue'
import "./index.scss"
// 状态栏高度
const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 0)

// 页面数据
const searchKeyword = ref('')
const currentTab = ref(0)
const refreshing = ref(false)
const loading = ref(false)
const loadingMore = ref(false)
const noMore = ref(false)
const pageNum = ref(1)
const pageSize = ref(10)
const taskList = ref([])

// 标签页配置
const tabList = ref([
  { name: '待办', value: 'pending' },
  { name: '全部', value: 'all' },
  { name: '已完成', value: 'completed' },
  { name: '未完成', value: 'uncompleted' },
  { name: '其他', value: 'other' }
])
// 模拟订单数据
const mockTasks = [
  {
    id: 1,
    name: 'A9二排5号机',
    deviceNo: 'A9-2-5',
    status: 'online',
    statusText: '在线',
    statusColor: '#2979ff',
    site: '湖南京广线-长沙南站-A区9号检票口',
    serialNo: 'SF7336190300055',
    responsible: '赵佳志',
    date: '2024-01-15 09:30',
    priority: 'high'
  },
  {
    id: 2,
    name: 'A9二排5号机',
    deviceNo: 'A9-2-5',
    status: 'offline',
    statusText: '离线',
    statusColor: '#909399',
    site: '湖南京广线-长沙南站-A区9号检票口',
    serialNo: 'SF7336190300055',
    responsible: '赵佳志',
    date: '2024-01-15 10:15',
    priority: 'medium'
  },
  {
    id: 3,
    name: 'A9二排5号机',
    deviceNo: 'A9-2-5',
    status: 'fault',
    statusText: '故障',
    statusColor: '#fa3534',
    site: '湖南京广线-长沙南站-A区9号检票口',
    serialNo: 'SF7336190300055',
    responsible: '赵佳志',
    date: '2024-01-15 11:20',
    priority: 'high'
  },
  {
    id: 4,
    name: 'A9二排5号机',
    deviceNo: 'A9-2-5',
    status: 'online',
    statusText: '在线',
    statusColor: '#2979ff',
    site: '湖南京广线-长沙南站-A区9号检票口',
    serialNo: 'SF7336190300055',
    responsible: '赵佳志',
    date: '2024-01-15 13:45',
    priority: 'low'
  }
]

// 事件处理函数
const handleTabChange = (e) => {
  currentTab.value = e.index
  refreshTaskList()
}

const handleSearch = (value) => {
  console.log('搜索关键词:', value)
  refreshTaskList()
}

const handleClearSearch = () => {
  searchKeyword.value = ''
  refreshTaskList()
}

const handleTaskClick = (task) => {
  console.log('点击订单:', task)
  uni.navigateTo({
    url: `/pages/order/detail/index?id=${task.id}`
  })
}

const handleScan = () => {
  // 调用扫一扫功能
  uni.scanCode({
    success: (res) => {
      console.log('扫码结果:', res.result)
      uni.showToast({
        title: '扫码成功',
        icon: 'success'
      })
      
      // 这里可以处理扫码结果，比如跳转到对应设备页面
      // handleScanResult(res.result)
    },
    fail: (err) => {
      console.error('扫码失败:', err)
      uni.showToast({
        title: '扫码失败，请重试',
        icon: 'none'
      })
    }
  })
}

const showMoreMenu = () => {
  uni.showActionSheet({
    title: '更多操作',
    itemList: ['刷新列表', '筛选设置', '导出数据', '关于'],
    success: (res) => {
      const index = res.tapIndex
      switch (index) {
        case 0:
          refreshTaskList()
          break
        case 1:
          showFilterModal()
          break
        case 2:
          exportData()
          break
        case 3:
          showAbout()
          break
      }
    }
  })
}

const goToDetail = (e) => {
  uni.navigateTo({
    url: '/pages/order/stats'
  })
}

// 数据获取函数
const fetchTaskList = async (isRefresh = false, isLoadMore = false) => {
  if (loading.value || (isLoadMore && noMore.value)) return
  
  if (isRefresh) {
    refreshing.value = true
    pageNum.value = 1
  } else if (isLoadMore) {
    loadingMore.value = true
    pageNum.value++
  } else {
    loading.value = true
  }
  
  try {
    // 模拟 API 请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (isRefresh || !isLoadMore) {
      taskList.value = [...mockTasks]
    } else {
      // 模拟加载更多数据
      const moreTasks = mockTasks.map(task => ({
        ...task,
        id: task.id + taskList.value.length
      }))
      taskList.value = [...taskList.value, ...moreTasks]
    }
    
    // 模拟没有更多数据的情况
    if (isLoadMore && pageNum.value >= 3) {	
      noMore.value = true
    }
  } catch (error) {
    console.error('获取订单列表失败:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
    loadingMore.value = false
    refreshing.value = false
  }
}

const refreshTaskList = () => {
  fetchTaskList(true)
}

const loadMore = () => {
  if (!noMore.value) {
    fetchTaskList(false, true)
  }
}

const onRefresh = () => {
  refreshTaskList()
}

// 辅助函数
const showFilterModal = () => {
  uni.showModal({
    title: '筛选设置',
    content: '筛选功能开发中...',
    showCancel: false
  })
}

const exportData = () => {
  uni.showToast({
    title: '导出功能开发中',
    icon: 'none'
  })
}

const showAbout = () => {
  uni.showModal({
    title: '关于',
    content: '巡检订单管理系统 v1.0.0',
    showCancel: false
  })
}

// 生命周期
onLoad(() => {
  fetchTaskList()
})

onShow(() => {
  // 页面显示时刷新数据
  refreshTaskList()
})
</script>

