<template>
  <view class="order-detail-page">
    <!-- 自定义导航栏 -->
    <u-navbar
      title="订单详情"
      :autoBack="true"
      :placeholder="true"
      bgColor="#ffffff"
    >
      <template #right>
        <u-icon
          name="more-dot-fill"
          color="#333"
          size="22"
          @click="showActionSheet = true"
        ></u-icon>
      </template>
    </u-navbar>

    <!-- 主要内容区域 -->
    <view class="content">
      <!-- 订单状态卡片 -->
      <view class="status-card">
        <u-icon
          :name="getStatusIcon(orderInfo.status)"
          size="40"
          :color="getStatusColor(orderInfo.status)"
        ></u-icon>
        <text class="status-text">{{ getStatusText(orderInfo.status) }}</text>
        <text class="status-desc">{{ getStatusDesc(orderInfo.status) }}</text>
        
        <view class="actions" v-if="orderInfo.status === 1">
          <u-button
            type="primary"
            size="small"
            text="立即支付"
            @click="handlePay"
          ></u-button>
          <u-button
            type="default"
            size="small"
            text="取消订单"
            @click="handleCancel"
          ></u-button>
        </view>
      </view>

      <!-- 收货地址 -->
      <view class="section address-section">
        <view class="section-header">
          <u-icon name="map-fill" color="#2979ff" size="20"></u-icon>
          <text class="section-title">收货地址</text>
        </view>
        <view class="address-info">
          <view class="address-top">
            <text class="receiver">{{ orderInfo.address.receiver }}</text>
            <text class="phone">{{ orderInfo.address.phone }}</text>
          </view>
          <text class="address-detail">{{ orderInfo.address.fullAddress }}</text>
        </view>
      </view>

      <!-- 订单商品列表 -->
      <view class="section goods-section">
        <view class="section-header">
          <u-icon name="bag-fill" color="#2979ff" size="20"></u-icon>
          <text class="section-title">商品信息</text>
        </view>
        <view class="goods-list">
          <view
            class="goods-item"
            v-for="(item, index) in orderInfo.goods"
            :key="index"
          >
            <u-image
              :src="item.image"
              width="80"
              height="80"
              radius="8"
            ></u-image>
            <view class="goods-info">
              <text class="goods-name">{{ item.name }}</text>
              <text class="goods-spec">{{ item.spec }}</text>
              <view class="goods-bottom">
                <text class="goods-price">¥{{ item.price }}</text>
                <text class="goods-quantity">×{{ item.quantity }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 订单信息 -->
      <view class="section order-info-section">
        <view class="section-header">
          <u-icon name="order" color="#2979ff" size="20"></u-icon>
          <text class="section-title">订单信息</text>
        </view>
        <view class="info-list">
          <view class="info-item">
            <text class="label">订单编号</text>
            <text class="value">{{ orderInfo.orderNo }}</text>
            <u-icon
              name="file-text"
              size="18"
              @click="copyOrderNo"
            ></u-icon>
          </view>
          <view class="info-item">
            <text class="label">下单时间</text>
            <text class="value">{{ orderInfo.createTime }}</text>
          </view>
          <view class="info-item">
            <text class="label">支付方式</text>
            <text class="value">{{ orderInfo.paymentMethod }}</text>
          </view>
          <view class="info-item">
            <text class="label">配送方式</text>
            <text class="value">{{ orderInfo.deliveryMethod }}</text>
          </view>
          <view class="info-item">
            <text class="label">买家留言</text>
            <text class="value" v-if="orderInfo.remark">{{ orderInfo.remark }}</text>
            <text class="value placeholder" v-else>无</text>
          </view>
        </view>
      </view>

      <!-- 价格明细 -->
      <view class="section price-section">
        <view class="price-item">
          <text class="label">商品总额</text>
          <text class="value">¥{{ orderInfo.totalAmount }}</text>
        </view>
        <view class="price-item">
          <text class="label">运费</text>
          <text class="value">+¥{{ orderInfo.shippingFee }}</text>
        </view>
        <view class="price-item">
          <text class="label">优惠券</text>
          <text class="value discount">-¥{{ orderInfo.discountAmount }}</text>
        </view>
        <view class="price-item total">
          <text class="label">实付款</text>
          <text class="value">¥{{ orderInfo.payAmount }}</text>
        </view>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar" v-if="showBottomActions">
      <view class="actions">
        <u-button
          v-if="orderInfo.status === 2"
          type="primary"
          text="确认收货"
          @click="handleConfirmReceipt"
        ></u-button>
        <u-button
          v-if="orderInfo.status === 0"
          type="error"
          text="删除订单"
          @click="handleDelete"
        ></u-button>
        <u-button
          v-if="orderInfo.status === 3"
          type="default"
          text="再次购买"
          @click="handleRebuy"
        ></u-button>
        <u-button
          v-if="orderInfo.status === 3"
          type="primary"
          plain
          text="申请售后"
          @click="handleAfterSale"
        ></u-button>
      </view>
    </view>
    <!-- 操作菜单 -->
    <u-action-sheet
      :show="showActionSheet"
      :actions="actions"
      title="更多操作"
      @close="showActionSheet = false"
      @select="onActionSelect"
    ></u-action-sheet>

    <!-- 删除确认对话框 -->
    <u-modal
      :show="showDeleteConfirm"
      title="确认删除"
      content="确定要删除这个订单吗？删除后不可恢复。"
      showCancelButton
      @confirm="confirmDelete"
      @cancel="showDeleteConfirm = false"
    ></u-modal>

    <!-- 加载动画 -->
    <u-loading-page
      :loading="loading"
      bgColor="#f8f8f8"
    ></u-loading-page>
	
  </view>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// 响应式数据
const loading = ref(true)
const showActionSheet = ref(false)
const showDeleteConfirm = ref(false)
const showBottomActions = computed(() => {
  return [0, 2, 3].includes(orderInfo.status)
})

// 订单信息
const orderInfo = reactive({
  id: '',
  orderNo: '',
  status: 1, // 0: 已取消, 1: 待付款, 2: 待发货/待收货, 3: 已完成
  createTime: '',
  paymentMethod: '',
  deliveryMethod: '',
  totalAmount: 0,
  shippingFee: 0,
  discountAmount: 0,
  payAmount: 0,
  remark: '',
  goods: [],
  address: {}
})

// 操作菜单选项
const actions = computed(() => {
  const baseActions = [
    { name: '查看物流', value: 'logistics' },
    { name: '联系客服', value: 'customerService' },
    { name: '复制订单号', value: 'copy' }
  ]
  
  if (orderInfo.status === 1) {
    baseActions.unshift({ name: '取消订单', value: 'cancel' })
  }
  
  return baseActions
})

// 生命周期
onLoad((options) => {
  if (options.id) {
    orderInfo.id = options.id
    fetchOrderDetail(options.id)
  }
})

// 获取订单详情
const fetchOrderDetail = (id) => {
  loading.value = true
  
  // 模拟API调用
  setTimeout(() => {
    // 模拟数据
    Object.assign(orderInfo, {
      id: id,
      orderNo: '20231225123456789',
      status: 1,
      createTime: '2023-12-25 14:30:25',
      paymentMethod: '微信支付',
      deliveryMethod: '快递配送',
      totalAmount: 198.00,
      shippingFee: 10.00,
      discountAmount: 20.00,
      payAmount: 188.00,
      remark: '请尽快发货，谢谢！',
      goods: [
        {
          id: 1,
          name: '商品名称示例商品名称示例商品名称示例',
          image: 'https://via.placeholder.com/80x80',
          spec: '颜色：白色；尺码：M',
          price: 99.00,
          quantity: 2
        },
        {
          id: 2,
          name: '另一个商品示例',
          image: 'https://via.placeholder.com/80x80',
          spec: '颜色：黑色；尺码：L',
          price: 89.00,
          quantity: 1
        }
      ],
      address: {
        receiver: '张三',
        phone: '13800138000',
        fullAddress: '广东省深圳市南山区科技园科苑路100号'
      }
    })
    
    loading.value = false
  }, 800)
}

// 状态相关方法
const getStatusIcon = (status) => {
  const icons = {
    0: 'close-circle-fill',
    1: 'clock-fill',
    2: 'car-fill',
    3: 'checkmark-circle-fill'
  }
  return icons[status] || 'info-circle-fill'
}

const getStatusColor = (status) => {
  const colors = {
    0: '#909399',
    1: '#f9ae3d',
    2: '#2979ff',
    3: '#19be6b'
  }
  return colors[status] || '#909399'
}

const getStatusText = (status) => {
  const texts = {
    0: '已取消',
    1: '待付款',
    2: '待收货',
    3: '已完成'
  }
  return texts[status] || '未知状态'
}

const getStatusDesc = (status) => {
  const descs = {
    0: '订单已取消',
    1: '请在30分钟内完成支付',
    2: '商品正在运输中',
    3: '交易已完成'
  }
  return descs[status] || ''
}

// 操作方法
const handlePay = () => {
  uni.showModal({
    title: '提示',
    content: '模拟支付流程',
    success: (res) => {
      if (res.confirm) {
        // 这里调用支付接口
        uni.showToast({
          title: '支付成功',
          icon: 'success'
        })
        // 更新订单状态
        orderInfo.status = 2
      }
    }
  })
}

const handleCancel = () => {
  uni.showModal({
    title: '取消订单',
    content: '确定要取消这个订单吗？',
    success: (res) => {
      if (res.confirm) {
        // 调用取消订单接口
        orderInfo.status = 0
        uni.showToast({
          title: '订单已取消',
          icon: 'success'
        })
      }
    }
  })
}

const handleConfirmReceipt = () => {
  uni.showModal({
    title: '确认收货',
    content: '请确认已收到商品',
    success: (res) => {
      if (res.confirm) {
        // 调用确认收货接口
        orderInfo.status = 3
        uni.showToast({
          title: '确认收货成功',
          icon: 'success'
        })
      }
    }
  })
}

const handleDelete = () => {
  showDeleteConfirm.value = true
}

const confirmDelete = () => {
  // 调用删除接口
  uni.showToast({
    title: '删除成功',
    icon: 'success'
  })
  setTimeout(() => {
    uni.navigateBack()
  }, 1500)
  showDeleteConfirm.value = false
}

const handleRebuy = () => {
  uni.showToast({
    title: '已加入购物车',
    icon: 'success'
  })
}

const handleAfterSale = () => {
  uni.navigateTo({
    url: '/pages/afterSale/apply'
  })
}

const copyOrderNo = () => {
  uni.setClipboardData({
    data: orderInfo.orderNo,
    success: () => {
      uni.showToast({
        title: '复制成功',
        icon: 'success'
      })
    }
  })
}

const onActionSelect = (item) => {
  showActionSheet.value = false
  
  switch (item.value) {
    case 'copy':
      copyOrderNo()
      break
    case 'logistics':
      uni.navigateTo({
        url: `/pages/order/logistics?id=${orderInfo.id}`
      })
      break
    case 'customerService':
      uni.makePhoneCall({
        phoneNumber: '400-123-4567'
      })
      break
    case 'cancel':
      handleCancel()
      break
  }
}
</script>

<style lang="scss" scoped>
.order-detail-page {
  min-height: 100vh;
  background-color: #f8f8f8;
  
  .content {
    padding: 20rpx;
  }
  
  .status-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 20rpx;
    padding: 40rpx 30rpx;
    color: white;
    text-align: center;
    margin-bottom: 20rpx;
    
    .status-text {
      display: block;
      font-size: 40rpx;
      font-weight: bold;
      margin: 20rpx 0 10rpx;
    }
    
    .status-desc {
      display: block;
      font-size: 28rpx;
      opacity: 0.9;
      margin-bottom: 30rpx;
    }
    
    .actions {
      display: flex;
      justify-content: center;
      gap: 20rpx;
      
      ::v-deep .u-button {
        width: 200rpx;
      }
    }
  }
  
  .section {
    background-color: white;
    border-radius: 20rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    
    .section-header {
      display: flex;
      align-items: center;
      margin-bottom: 30rpx;
      padding-bottom: 20rpx;
      border-bottom: 2rpx solid #f5f5f5;
      
      .section-title {
        font-size: 32rpx;
        font-weight: 600;
        margin-left: 15rpx;
        color: #333;
      }
    }
  }
  
  .address-section {
    .address-info {
      .address-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20rpx;
        
        .receiver {
          font-size: 34rpx;
          font-weight: 600;
          color: #333;
        }
        
        .phone {
          font-size: 30rpx;
          color: #666;
        }
      }
      
      .address-detail {
        font-size: 30rpx;
        color: #666;
        line-height: 1.5;
      }
    }
  }
  
  .goods-section {
    .goods-list {
      .goods-item {
        display: flex;
        padding: 20rpx 0;
        
        &:not(:last-child) {
          border-bottom: 2rpx solid #f5f5f5;
        }
        
        .goods-info {
          flex: 1;
          margin-left: 20rpx;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          
          .goods-name {
            font-size: 30rpx;
            color: #333;
            line-height: 1.4;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          
          .goods-spec {
            font-size: 26rpx;
            color: #999;
            margin: 10rpx 0;
          }
          
          .goods-bottom {
            display: flex;
            justify-content: space-between;
            align-items: center;
            
            .goods-price {
              font-size: 32rpx;
              color: #e4393c;
              font-weight: 600;
            }
            
            .goods-quantity {
              font-size: 28rpx;
              color: #666;
            }
          }
        }
      }
    }
  }
  
  .order-info-section {
    .info-list {
      .info-item {
        display: flex;
        align-items: center;
        padding: 20rpx 0;
        
        &:not(:last-child) {
          border-bottom: 2rpx solid #f5f5f5;
        }
        
        .label {
          font-size: 28rpx;
          color: #999;
          width: 180rpx;
          flex-shrink: 0;
        }
        
        .value {
          flex: 1;
          font-size: 28rpx;
          color: #333;
          margin-right: 20rpx;
          
          &.placeholder {
            color: #999;
          }
        }
      }
    }
  }
  
  .price-section {
    .price-item {
      display: flex;
      justify-content: space-between;
      padding: 20rpx 0;
      
      .label {
        font-size: 28rpx;
        color: #666;
      }
      
      .value {
        font-size: 28rpx;
        color: #333;
        
        &.discount {
          color: #19be6b;
        }
      }
      
      &.total {
        border-top: 2rpx solid #f5f5f5;
        margin-top: 10rpx;
        padding-top: 30rpx;
        
        .label {
          font-size: 32rpx;
          font-weight: 600;
          color: #333;
        }
        
        .value {
          font-size: 36rpx;
          color: #e4393c;
          font-weight: 600;
        }
      }
    }
  }
  
  .bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    padding: 20rpx 30rpx;
    box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.1);
    
    .actions {
      display: flex;
      gap: 20rpx;
      
      ::v-deep .u-button {
        flex: 1;
      }
    }
  }
}
</style>