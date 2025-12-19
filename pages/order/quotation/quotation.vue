<template>
  <view class="container">
    <!-- 顶部导航 -->
    <u-navbar
      title="布料纺织品报价"
      :placeholder="true"
      :autoBack="true"
      bgColor="#ffffff"
    >
      <template #right>
        <u-icon name="list" size="20" @click="showFilter = true"></u-icon>
      </template>
    </u-navbar>

    <!-- 搜索区域 -->
    <view class="search-box">
      <u-search
        v-model="searchKeyword"
        placeholder="搜索布料名称、材质或编号"
        :showAction="false"
        @search="handleSearch"
        @clear="handleClearSearch"
      ></u-search>
    </view>

    <!-- 筛选标签 -->
    <view class="filter-tabs">
      <u-tabs
        :list="tabList"
        :current="currentTab"
        @change="handleTabChange"
        lineWidth="20"
        lineHeight="3"
        :activeStyle="{
          color: '#8B4513',
          fontWeight: 'bold',
          transform: 'scale(1.05)'
        }"
        :inactiveStyle="{
          color: '#606266',
          transform: 'scale(1)'
        }"
        itemStyle="padding-left: 15px; padding-right: 15px; height: 34px;"
      ></u-tabs>
    </view>

    <!-- 产品列表 -->
    <scroll-view
      scroll-y
      class="product-scroll"
      refresher-enabled
      @refresherrefresh="onRefresh"
      :refresher-triggered="refreshing"
    >
      <!-- 下拉刷新 -->
      <u-pull-refresh
        :refreshTriggered="refreshing"
        @refresh="onRefresh"
        bgColor="#f5f7fa"
      />

      <!-- 产品卡片列表 -->
      <view class="product-list">
        <view
          v-for="fabric in filteredFabrics"
          :key="fabric.id"
          class="fabric-card"
        >
          <u-card
            :border="false"
            padding="0"
            margin="0 0 15rpx 0"
            :showHead="false"
          >
            <template #body>
              <view class="card-content">
                <!-- 布料图片 -->
                <u-image
                  :src="fabric.image"
                  width="120px"
                  height="120px"
                  radius="8px"
                  mode="aspectFill"
                ></u-image>
                
                <!-- 布料信息 -->
                <view class="fabric-info">
                  <view class="fabric-header">
                    <text class="fabric-title">{{ fabric.name }}</text>
                    <text class="fabric-code">{{ fabric.code }}</text>
                  </view>
                  
                  <view class="spec-grid">
                    <view class="spec-item">
                      <text class="spec-label">材质:</text>
                      <text class="spec-value">{{ fabric.material }}</text>
                    </view>
                    <view class="spec-item">
                      <text class="spec-label">克重:</text>
                      <text class="spec-value">{{ fabric.weight }}g/㎡</text>
                    </view>
                    <view class="spec-item">
                      <text class="spec-label">幅宽:</text>
                      <text class="spec-value">{{ fabric.width }}cm</text>
                    </view>
                    <view class="spec-item">
                      <text class="spec-label">颜色:</text>
                      <text class="spec-value">{{ fabric.colors.join(', ') }}</text>
                    </view>
                  </view>
                  
                  <view class="price-section">
                    <view class="price-info">
                      <text class="current-price">¥{{ fabric.price }}/米</text>
                      <text class="original-price" v-if="fabric.originalPrice">
                        ¥{{ fabric.originalPrice }}/米
                      </text>
                    </view>
                    
                    <u-button
                      type="primary"
                      size="mini"
                      :plain="!fabric.inQuotation"
                      :loading="fabric.adding"
                      @click="handleAddToQuotation(fabric)"
                      customStyle="background: #8B4513; border-color: #8B4513;"
                    >
                      {{ fabric.inQuotation ? '已添加' : '加入报价' }}
                    </u-button>
                  </view>
                </view>
              </view>
            </template>
          </u-card>
        </view>
      </view>

      <!-- 空状态 -->
      <u-empty
        v-if="filteredFabrics.length === 0"
        mode="data"
        icon="http://cdn.uviewui.com/uview/empty/data.png"
        text="暂无相关布料"
      >
      </u-empty>

      <!-- 加载更多 -->
      <u-loadmore
        :status="loadStatus"
        @loadmore="loadMore"
        v-if="filteredFabrics.length > 0"
      />
    </scroll-view>

    <!-- 报价单悬浮按钮 -->
    <view class="floating-quotation" @click="showQuotationPanel = true">
      <u-badge :value="quotationCount" max="99" :offset="[-10, -10]">
        <u-icon name="file-text" size="24" color="#ffffff"></u-icon>
      </u-badge>
    </view>

    <!-- 报价单面板 -->
    <u-popup
      :show="showQuotationPanel"
      mode="bottom"
      @close="showQuotationPanel = false"
      round="20"
      closeable
    >
      <view class="quotation-panel">
        <view class="panel-header">
          <text class="panel-title">我的报价单 ({{ quotationCount }})</text>
        </view>
        
        <scroll-view scroll-y class="quotation-list">
          <view 
            v-for="item in quotationItems" 
            :key="item.id"
            class="quotation-item"
          >
            <view class="item-info">
              <text class="item-name">{{ item.name }}</text>
              <text class="item-spec">{{ item.material }} | {{ item.width }}cm | {{ item.colors.join(', ') }}</text>
            </view>
            
            <view class="item-controls">
              <view class="quantity-control">
                <u-button 
                  type="primary" 
                  size="mini" 
                  plain 
                  @click="decreaseQuantity(item)"
                  :disabled="item.quantity <= 1"
                >
                  -
                </u-button>
                <text class="quantity">{{ item.quantity }}米</text>
                <u-button 
                  type="primary" 
                  size="mini" 
                  plain 
                  @click="increaseQuantity(item)"
                >
                  +
                </u-button>
              </view>
              
              <view class="item-price">
                ¥{{ (item.price * item.quantity).toFixed(2) }}
              </view>
              
              <u-icon 
                name="trash" 
                size="18" 
                color="#e74c3c" 
                @click="removeFromQuotation(item)"
              ></u-icon>
            </view>
          </view>
        </scroll-view>
        
        <view class="panel-footer">
          <view class="total-price">
            总计: <text class="price">¥{{ totalPrice.toFixed(2) }}</text>
          </view>
          <u-button type="primary" @click="generateQuotation">生成报价单</u-button>
        </view>
      </view>
    </u-popup>

    <!-- 筛选弹窗 -->
    <u-popup
      :show="showFilter"
      mode="right"
      @close="showFilter = false"
      round="20"
    >
      <view class="filter-panel">
        <view class="filter-header">
          <text class="filter-title">筛选条件</text>
          <u-icon name="close" size="20" @click="showFilter = false"></u-icon>
        </view>
        
        <scroll-view scroll-y class="filter-content">
          <view class="filter-section">
            <text class="section-title">材质类型</text>
            <view class="material-list">
              <u-tag
                v-for="material in materials"
                :key="material"
                :text="material"
                :plain="!filterParams.materials.includes(material)"
                type="primary"
                size="large"
                @click="toggleMaterial(material)"
                style="margin: 5px 8px 5px 0;"
              ></u-tag>
            </view>
          </view>
          
          <view class="filter-section">
            <text class="section-title">价格区间 (元/米)</text>
            <view class="price-range">
              <u-input
                v-model="filterParams.minPrice"
                placeholder="最低价"
                type="number"
              ></u-input>
              <text class="range-separator">-</text>
              <u-input
                v-model="filterParams.maxPrice"
                placeholder="最高价"
                type="number"
              ></u-input>
            </view>
          </view>
          
          <view class="filter-section">
            <text class="section-title">克重范围 (g/㎡)</text>
            <view class="weight-range">
              <u-input
                v-model="filterParams.minWeight"
                placeholder="最小克重"
                type="number"
              ></u-input>
              <text class="range-separator">-</text>
              <u-input
                v-model="filterParams.maxWeight"
                placeholder="最大克重"
                type="number"
              ></u-input>
            </view>
          </view>
          
          <view class="filter-section">
            <text class="section-title">排序方式</text>
            <u-radio-group v-model="filterParams.sortBy">
              <u-radio
                v-for="sort in sortOptions"
                :key="sort.value"
                :name="sort.value"
                :label="sort.label"
                style="margin-bottom: 10px;"
              ></u-radio>
            </u-radio-group>
          </view>
        </scroll-view>
        
        <view class="filter-actions">
          <u-button type="default" @click="resetFilter">重置</u-button>
          <u-button type="primary" @click="applyFilter">确定</u-button>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 响应式数据
const searchKeyword = ref('')
const currentTab = ref(0)
const showFilter = ref(false)
const showQuotationPanel = ref(false)
const refreshing = ref(false)
const loadStatus = ref('loadmore')
const quotationCount = ref(0)

// 筛选参数
const filterParams = ref({
  materials: [],
  minPrice: '',
  maxPrice: '',
  minWeight: '',
  maxWeight: '',
  sortBy: 'default'
})

// 模拟数据
const tabList = ref([
  { name: '全部布料' },
  { name: '棉纺' },
  { name: '化纤' },
  { name: '混纺' },
  { name: '丝绸' },
  { name: '毛纺' }
])

const materials = ref(['纯棉', '涤纶', '尼龙', '丝绸', '羊毛', '麻', '混纺'])
const sortOptions = ref([
  { label: '默认排序', value: 'default' },
  { label: '价格从低到高', value: 'price_asc' },
  { label: '价格从高到低', value: 'price_desc' },
  { label: '克重从低到高', value: 'weight_asc' }
])

const fabrics = ref([
  {
    id: 1,
    name: '纯棉帆布',
    code: 'MF-2023001',
    material: '纯棉',
    weight: 320,
    width: 150,
    colors: ['白色', '米色', '卡其色'],
    price: 25.8,
    originalPrice: 28.5,
    image: 'https://via.placeholder.com/300x300/8B4513/ffffff?text=纯棉帆布',
    category: '棉纺',
    inQuotation: false,
    adding: false
  },
  {
    id: 2,
    name: '涤纶牛津布',
    code: 'MF-2023002',
    material: '涤纶',
    weight: 210,
    width: 145,
    colors: ['黑色', '军绿色', '深蓝色'],
    price: 18.5,
    originalPrice: 20.0,
    image: 'https://via.placeholder.com/300x300/4caf50/ffffff?text=牛津布',
    category: '化纤',
    inQuotation: false,
    adding: false
  },
  {
    id: 3,
    name: '丝绸缎面',
    code: 'MF-2023003',
    material: '丝绸',
    weight: 85,
    width: 140,
    colors: ['红色', '紫色', '宝蓝色', '香槟色'],
    price: 68.0,
    image: 'https://via.placeholder.com/300x300/ff9800/ffffff?text=丝绸',
    category: '丝绸',
    inQuotation: true,
    adding: false
  },
  {
    id: 4,
    name: '羊毛呢料',
    code: 'MF-2023004',
    material: '羊毛',
    weight: 380,
    width: 150,
    colors: ['灰色', '藏青色', '咖啡色'],
    price: 95.0,
    originalPrice: 108.0,
    image: 'https://via.placeholder.com/300x300/2196f3/ffffff?text=羊毛呢',
    category: '毛纺',
    inQuotation: false,
    adding: false
  },
  {
    id: 5,
    name: '棉麻混纺',
    code: 'MF-2023005',
    material: '混纺',
    weight: 180,
    width: 145,
    colors: ['本色', '浅灰色', '米白色'],
    price: 32.5,
    image: 'https://via.placeholder.com/300x300/9c27b0/ffffff?text=棉麻混纺',
    category: '混纺',
    inQuotation: false,
    adding: false
  }
])

// 报价单数据
const quotationItems = ref([
  {
    id: 3,
    name: '丝绸缎面',
    material: '丝绸',
    width: 140,
    colors: ['红色', '紫色', '宝蓝色', '香槟色'],
    price: 68.0,
    quantity: 15
  }
])

// 计算属性
const filteredFabrics = computed(() => {
  let result = fabrics.value.filter(fabric => {
    // 搜索关键词过滤
    if (searchKeyword.value && 
        !fabric.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) &&
        !fabric.code.toLowerCase().includes(searchKeyword.value.toLowerCase()) &&
        !fabric.material.toLowerCase().includes(searchKeyword.value.toLowerCase())) {
      return false
    }
    
    // 标签过滤
    if (currentTab.value > 0) {
      const category = tabList.value[currentTab.value].name
      if (category === '全部布料' || fabric.category === category.replace('布料', '')) {
        // 通过
      } else {
        return false
      }
    }
    
    // 材质过滤
    if (filterParams.value.materials.length > 0 && 
        !filterParams.value.materials.includes(fabric.material)) {
      return false
    }
    
    // 价格区间过滤
    if (filterParams.value.minPrice && fabric.price < Number(filterParams.value.minPrice)) {
      return false
    }
    if (filterParams.value.maxPrice && fabric.price > Number(filterParams.value.maxPrice)) {
      return false
    }
    
    // 克重过滤
    if (filterParams.value.minWeight && fabric.weight < Number(filterParams.value.minWeight)) {
      return false
    }
    if (filterParams.value.maxWeight && fabric.weight > Number(filterParams.value.maxWeight)) {
      return false
    }
    
    return true
  })
  
  // 排序
  switch (filterParams.value.sortBy) {
    case 'price_asc':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price_desc':
      result.sort((a, b) => b.price - a.price)
      break
    case 'weight_asc':
      result.sort((a, b) => a.weight - b.weight)
      break
  }
  
  return result
})

const totalPrice = computed(() => {
  return quotationItems.value.reduce((total, item) => {
    return total + (item.price * item.quantity)
  }, 0)
})

// 方法
const handleSearch = () => {
  console.log('搜索:', searchKeyword.value)
}

const handleClearSearch = () => {
  searchKeyword.value = ''
}

const handleTabChange = (index) => {
  currentTab.value = index
}

const handleAddToQuotation = async (fabric) => {
  if (fabric.adding) return
  
  fabric.adding = true
  // 模拟网络请求
  await new Promise(resolve => setTimeout(resolve, 800))
  
  if (fabric.inQuotation) {
    // 如果已经在报价单中，则移除
    const index = quotationItems.value.findIndex(item => item.id === fabric.id)
    if (index > -1) {
      quotationItems.value.splice(index, 1)
    }
    fabric.inQuotation = false
    quotationCount.value--
  } else {
    // 添加到报价单
    quotationItems.value.push({
      id: fabric.id,
      name: fabric.name,
      material: fabric.material,
      width: fabric.width,
      colors: fabric.colors,
      price: fabric.price,
      quantity: 10  // 默认10米
    })
    fabric.inQuotation = true
    quotationCount.value++
    
    uni.showToast({
      title: '已加入报价单',
      icon: 'success'
    })
  }
  
  fabric.adding = false
}

const increaseQuantity = (item) => {
  item.quantity += 1
}

const decreaseQuantity = (item) => {
  if (item.quantity > 1) {
    item.quantity -= 1
  }
}

const removeFromQuotation = (item) => {
  const index = quotationItems.value.findIndex(i => i.id === item.id)
  if (index > -1) {
    quotationItems.value.splice(index, 1)
    
    // 更新布料状态
    const fabric = fabrics.value.find(f => f.id === item.id)
    if (fabric) {
      fabric.inQuotation = false
    }
    
    quotationCount.value--
  }
}

const generateQuotation = () => {
  uni.showModal({
    title: '生成报价单',
    content: '是否确认生成报价单？',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({
          title: '报价单已生成',
          icon: 'success'
        })
        // 这里可以添加实际生成报价单的逻辑
      }
    }
  })
}

const onRefresh = () => {
  refreshing.value = true
  setTimeout(() => {
    refreshing.value = false
    uni.showToast({
      title: '刷新成功',
      icon: 'success'
    })
  }, 1000)
}

const loadMore = () => {
  loadStatus.value = 'loading'
  setTimeout(() => {
    // 模拟加载更多数据
    loadStatus.value = 'nomore'
  }, 1000)
}

const toggleMaterial = (material) => {
  const index = filterParams.value.materials.indexOf(material)
  if (index > -1) {
    filterParams.value.materials.splice(index, 1)
  } else {
    filterParams.value.materials.push(material)
  }
}

const resetFilter = () => {
  filterParams.value = {
    materials: [],
    minPrice: '',
    maxPrice: '',
    minWeight: '',
    maxWeight: '',
    sortBy: 'default'
  }
}

const applyFilter = () => {
  showFilter.value = false
}

onMounted(() => {
  // 初始化报价单数量
  quotationCount.value = quotationItems.value.length
  
  // 标记已在报价单中的布料
  quotationItems.value.forEach(item => {
    const fabric = fabrics.value.find(f => f.id === item.id)
    if (fabric) {
      fabric.inQuotation = true
    }
  })
})
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.search-box {
  padding: 15rpx;
  background: #ffffff;
}

.filter-tabs {
  background: #ffffff;
  border-bottom: 1rpx solid #f0f0f0;
}

.product-scroll {
  height: calc(100vh - 200rpx);
}

.product-list {
  padding: 20rpx;
}

.fabric-card {
  margin-bottom: 20rpx;
}

.card-content {
  display: flex;
  padding: 20rpx;
}

.fabric-info {
  flex: 1;
  margin-left: 20rpx;
  display: flex;
  flex-direction: column;
}

.fabric-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10rpx;
}

.fabric-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #8B4513;
  flex: 1;
  margin-right: 10rpx;
}

.fabric-code {
  font-size: 22rpx;
  color: #999;
}

.spec-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8rpx;
  margin-bottom: 20rpx;
}

.spec-item {
  display: flex;
  justify-content: space-between;
}

.spec-label {
  font-size: 24rpx;
  color: #666;
}

.spec-value {
  font-size: 24rpx;
  font-weight: 500;
}

.price-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.price-info {
  display: flex;
  flex-direction: column;
}

.current-price {
  font-size: 32rpx;
  font-weight: 600;
  color: #e74c3c;
}

.original-price {
  font-size: 24rpx;
  color: #999;
  text-decoration: line-through;
}

.floating-quotation {
  position: fixed;
  right: 30rpx;
  bottom: 100rpx;
  width: 100rpx;
  height: 100rpx;
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 32rpx rgba(139, 69, 19, 0.4);
  z-index: 1000;
}

.quotation-panel {
  height: 70vh;
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  text-align: center;
}

.panel-title {
  font-size: 32rpx;
  font-weight: 600;
}

.quotation-list {
  flex: 1;
  padding: 0 30rpx;
}

.quotation-item {
  display: flex;
  justify-content: space-between;
  padding: 30rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.item-info {
  flex: 1;
  margin-right: 20rpx;
}

.item-name {
  font-size: 28rpx;
  font-weight: 500;
  display: block;
  margin-bottom: 10rpx;
}

.item-spec {
  font-size: 24rpx;
  color: #999;
}

.item-controls {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.quantity-control {
  display: flex;
  align-items: center;
  margin-bottom: 15rpx;
}

.quantity {
  margin: 0 20rpx;
  font-size: 28rpx;
}

.item-price {
  font-size: 28rpx;
  font-weight: 600;
  color: #e74c3c;
  margin-bottom: 15rpx;
}

.panel-footer {
  padding: 30rpx;
  border-top: 1rpx solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-price {
  font-size: 28rpx;
}

.price {
  font-size: 32rpx;
  font-weight: 600;
  color: #e74c3c;
  margin-left: 10rpx;
}

.filter-panel {
  width: 600rpx;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.filter-title {
  font-size: 32rpx;
  font-weight: 600;
}

.filter-content {
  flex: 1;
  padding: 30rpx;
}

.filter-section {
  margin-bottom: 40rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 500;
  display: block;
  margin-bottom: 20rpx;
}

.price-range, .weight-range {
  display: flex;
  align-items: center;
}

.range-separator {
  margin: 0 20rpx;
}

.filter-actions {
  display: flex;
  padding: 30rpx;
  border-top: 1rpx solid #f0f0f0;
  
  .u-button {
    flex: 1;
    margin: 0 10rpx;
  }
}
</style>