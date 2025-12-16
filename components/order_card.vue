<!-- components/order-card.vue -->
<template>
  <view class="order-card" @click="$emit('click', task)">
    <!-- 状态指示条 -->
    <view class="status-indicator" :style="{ backgroundColor: getStatusColor(task.status) }"></view>
    
    <view class="card-content">
      <!-- 标题行 -->
      <view class="card-header">
        <view class="title-section">
          <text class="field-label">名称</text>
          <view class="status-badge" :style="{ color: getStatusColor(task.status) }">
            {{ task.statusText }}
          </view>
          <text class="device-name">{{ task.name }}</text>
        </view>
        <view v-if="task.priority === 'high'" class="priority-badge high">
          紧急
        </view>
        <view v-else-if="task.priority === 'medium'" class="priority-badge medium">
          重要
        </view>
      </view>
      
      <!-- 设备信息 -->
      <view class="info-row">
        <text class="field-label">网点</text>
        <text class="field-value site-info">{{ task.site }}</text>
      </view>
      
      <view class="info-row">
        <text class="field-label">编号</text>
        <text class="field-value">{{ task.serialNo }}</text>
      </view>
      
      <view class="info-row">
        <text class="field-label">负责人</text>
        <view class="responsible-info">
          <text class="field-value">{{ task.responsible }}</text>
          <text class="date">{{ task.date }}</text>
        </view>
      </view>
      
      <!-- 操作按钮 -->
      <view class="action-buttons">
        <u-button
          v-if="task.status === 'fault'"
          type="error"
          size="mini"
          shape="circle"
          @click.stop="handleRepair"
        >
          立即维修
        </u-button>
        
        <u-button
          v-else-if="task.status === 'offline'"
          type="warning"
          size="mini"
          shape="circle"
          @click.stop="handleCheck"
        >
          检查设备
        </u-button>
        
        <u-button
          v-else
          type="primary"
          size="mini"
          shape="circle"
          @click.stop="handleInspect"
        >
          开始巡检
        </u-button>
        
        <u-button
          type="info"
          size="mini"
          plain
          shape="circle"
          @click.stop="handleDetail"
        >
          详情
        </u-button>
      </view>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  task: {
    type: Object,
    required: true,
    default: () => ({})
  }
})

const emit = defineEmits(['click'])

// 状态颜色映射
const statusColorMap = {
  online: '#2979ff',    // 蓝色
  offline: '#909399',  // 灰色
  fault: '#fa3534'     // 红色
}

// 获取状态颜色
const getStatusColor = (status) => {
  return statusColorMap[status] || '#909399'
}

// 事件处理
const handleRepair = () => {
  uni.showModal({
    title: '维修确认',
    content: `确定要开始维修 ${props.task.name} 吗？`,
    success: (res) => {
      if (res.confirm) {
        uni.showToast({
          title: '开始维修',
          icon: 'success'
        })
        // 这里可以调用维修接口
      }
    }
  })
}

const handleCheck = () => {
  uni.navigateTo({
    url: `/pages/device/check?id=${props.task.id}`
  })
}

const handleInspect = () => {
  uni.navigateTo({
    url: `/pages/order/start?id=${props.task.id}`
  })
}

const handleDetail = () => {
  emit('click', props.task)
}
</script>

<style lang="scss" scoped>
.order-card {
  position: relative;
  background: #ffffff;
  border-radius: 16rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:active {
    transform: translateY(-2rpx);
    box-shadow: 0 6rpx 30rpx rgba(0, 0, 0, 0.1);
  }
  
  .status-indicator {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 8rpx;
  }
  
  .card-content {
    padding: 32rpx;
    margin-left: 8rpx;
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24rpx;
    
    .title-section {
      flex: 1;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 16rpx;
      
      .field-label {
        font-size: 28rpx;
        color: #909399;
        font-weight: 400;
      }
      
      .status-badge {
        font-size: 24rpx;
        font-weight: 500;
        padding: 4rpx 12rpx;
        background-color: rgba(41, 121, 255, 0.1);
        border-radius: 6rpx;
      }
      
      .device-name {
        font-size: 32rpx;
        color: #303133;
        font-weight: 600;
      }
    }
    
    .priority-badge {
      padding: 8rpx 16rpx;
      border-radius: 20rpx;
      font-size: 22rpx;
      font-weight: 500;
      
      &.high {
        background-color: #fef0f0;
        color: #fa3534;
      }
      
      &.medium {
        background-color: #fdf6ec;
        color: #e6a23c;
      }
    }
  }
  
  .info-row {
    display: flex;
    margin-bottom: 20rpx;
    align-items: flex-start;
    
    .field-label {
      width: 140rpx;
      font-size: 28rpx;
      color: #909399;
      font-weight: 400;
      flex-shrink: 0;
    }
    
    .field-value {
      flex: 1;
      font-size: 28rpx;
      color: #303133;
      font-weight: 500;
      line-height: 1.4;
      
      &.site-info {
        word-break: break-all;
      }
    }
    
    .responsible-info {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .date {
        font-size: 24rpx;
        color: #c0c4cc;
        font-weight: 400;
      }
    }
  }
  
  .action-buttons {
    display: flex;
    gap: 20rpx;
    margin-top: 32rpx;
    padding-top: 24rpx;
    border-top: 1rpx solid #f2f2f2;
    
    ::v-deep .u-button {
      flex: 1;
    }
  }
}
</style>