<template>
  <view class="container">
    <!-- 顶部搜索栏 -->
    <view class="search-section">
      <u-search
        v-model="searchKeyword"
        placeholder="输入原料名称或编号搜索"
        :show-action="false"
        @search="handleSearch"
        @clear="handleSearch"
        bg-color="#ffffff"
        border-color="#e0e0e0"
        shape="square"
        height="40"
      ></u-search>
      <u-button
        class="filter-toggle"
        type="primary"
        @click="toggleFilterPanel"
        :icon="showFilterPanel ? 'arrow-up' : 'arrow-down'"
        size="small"
        custom-style="height: 40px; display: flex; align-items: center; justify-content: center;"
      >
        {{ showFilterPanel ? '收起筛选' : '展开筛选' }}
      </u-button>
    </view>

    <!-- 筛选条件面板 -->
    <view class="filter-panel" v-if="showFilterPanel">
      <view class="filter-row">
        <view class="filter-item" @click="showCategoryPicker = true">
          <text class="filter-label">原料分类</text>
          <view class="picker-wrapper">
            <u-input
              v-model="categoryDisplay"
              placeholder="选择原料分类"
              readonly
              border="bottom"
              suffix-icon="arrow-down"
              suffix-icon-style="color: #909399;"
              input-align="left"
              custom-style="display: flex; align-items: center;"
            ></u-input>
          </view>
        </view>
        <view class="filter-item">
          <text class="filter-label">供应商</text>
          <u-input
            v-model="filterForm.supplier"
            placeholder="输入供应商名称"
            clearable
            border="bottom"
            @change="handleFilterChange"
            input-align="left"
            custom-style="display: flex; align-items: center;"
          ></u-input>
        </view>
        <view class="filter-item"  @click="showStockStatusPicker = true">
          <text class="filter-label">库存状态</text>
          <view class="picker-wrapper">
            <u-input			 
              v-model="stockStatusDisplay"
              placeholder="选择库存状态"
              readonly
              border="bottom"
              suffix-icon="arrow-down"
              suffix-icon-style="color: #909399;"
              input-align="left"
              custom-style="display: flex; align-items: center;"
            ></u-input>
          </view>
        </view>
      </view>
      <view class="filter-row">
        <view class="filter-item">
          <text class="filter-label">最小库存</text>
          <u-input
            v-model="filterForm.minStock"
            placeholder="最小库存量"
            type="number"
            clearable
            border="bottom"
            @change="handleFilterChange"
            input-align="left"
            custom-style="display: flex; align-items: center;"
          ></u-input>
        </view>
        <view class="filter-item">
          <text class="filter-label">最大库存</text>
          <u-input
            v-model="filterForm.maxStock"
            placeholder="最大库存量"
            type="number"
            clearable
            border="bottom"
            @change="handleFilterChange"
            input-align="left"
            custom-style="display: flex; align-items: center;"
          ></u-input>
        </view>
        <view class="filter-item" @click="showDatePicker = true">
          <text class="filter-label">添加时间</text>
          <view class="picker-wrapper">
            <u-input
              v-model="dateDisplay"
              placeholder="选择日期"
              readonly
              border="bottom"
              suffix-icon="calendar"
              suffix-icon-style="color: #909399;"
              input-align="left"
              custom-style="display: flex; align-items: center;"
            ></u-input>
          </view>
        </view>
      </view>
      <view class="filter-actions">
        <u-button 
          type="primary" 
          @click="handleFilter" 
          icon="search"
          custom-style="display: flex; align-items: center; justify-content: center; height: 36px;"
		  text="查询"
        >     
        </u-button>
        <u-button 
          @click="resetFilters" 
          icon="reload"
          custom-style="display: flex; align-items: center; justify-content: center; height: 36px;"
		  text="重置"
        >
        </u-button>
      </view>
    </view>

    <!-- 原料分类选择器 -->
    <u-picker 
      v-model:show="showCategoryPicker" 
      :columns="[categoryOptions]" 
      keyName="label"
      @confirm="handleCategoryConfirm"
      @cancel="showCategoryPicker = false"
      title="选择原料分类"
    ></u-picker>

    <!-- 库存状态选择器 -->
    <u-picker 
      :show="showStockStatusPicker" 
      :columns="[stockStatusOptions]" 
      keyName="label"
      @confirm="handleStockStatusConfirm"
      @cancel="showStockStatusPicker = false"
      title="选择库存状态"
    ></u-picker>

    <!-- 日期选择器 -->
    <u-datetime-picker
      :show="showDatePicker"
      v-model="filterForm.addDate"
      mode="date"
      @confirm="handleDateConfirm"
      @cancel="showDatePicker = false"
      title="选择日期"
    ></u-datetime-picker>

    <!-- 列表区域 -->
    <view class="list-container">
      <!-- 加载状态 -->
      <view class="loading" v-if="loading"> 
        <u-loading-icon text="加载中..." size="20" color="#2979ff"></u-loading-icon>
      </view>

      <!-- 空状态 -->
      <view class="empty-state" v-else-if="filteredMaterials.length === 0">
        <u-empty 
          mode="data" 
          icon="/static/images/empty-data.png"
          text="暂无原料数据"
        >
          <view v-if="hasActiveFilters" class="empty-tip">
            <text>当前筛选条件无匹配结果，</text>
            <text class="reset-link" @click="resetFilters">重置筛选条件</text>
          </view>
        </u-empty>
      </view>

      <!-- 列表内容 -->
      <view v-else>
        <view 
          class="list-item" 
          v-for="material in filteredMaterials" 
          :key="material.id"
          @click="handleItemClick(material)"
        >
          <view class="item-left">
            <view class="item-icon">   
              <u-icon 
                :name="getCategoryIcon(material.categoryValue)" 
                size="24" 
                :color="getCategoryColor(material.categoryValue)"  
              ></u-icon>
            </view>
          </view>
          <view class="item-info">
            <view class="item-name">
              {{ material.name }}
              <text class="item-code">({{ material.code }})</text>
            </view>
            <view class="item-details">
              <view class="detail-item">
                <u-icon name="grid" size="14" color="#909399"></u-icon>
                <text class="detail-text">{{ material.category }}</text>
              </view>
              <view class="detail-item">
                <u-icon name="account" size="14" color="#909399"></u-icon>
                <text class="detail-text">{{ material.supplier }}</text>
              </view>
              <view class="detail-item">
                <u-icon name="list-dot" size="14" color="#909399"></u-icon>
                <text class="detail-text">{{ material.stock }}{{ material.unit }}</text>
              </view>
              <view class="detail-item">
                <u-icon name="calendar" size="14" color="#909399"></u-icon>
                <text class="detail-text">{{ material.addTime }}</text>
              </view>
            </view>
          </view>
          <view class="item-right">
            <u-tag 
              :text="getStatusText(material.stockStatus)" 
              :type="getStatusType(material.stockStatus)"
              size="mini"
              :plain="material.stockStatus !== 'available'"
              custom-style="display: flex; align-items: center;"
            ></u-tag>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 底部操作栏 -->
    <view class="footer-actions" v-if="!loading">
      <u-button 
        type="primary" 
        icon="plus" 
        @click="handleAddMaterial"
        custom-style="display: flex; align-items: center; justify-content: center; height: 44px;"
		text="新增原料"
      >
      </u-button>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

// 搜索关键词
const searchKeyword = ref('')

// 是否显示筛选面板
const showFilterPanel = ref(false)

// 是否显示选择器
const showCategoryPicker = ref(false)
const showStockStatusPicker = ref(false)
const showDatePicker = ref(false)

// 筛选表单
const filterForm = reactive({
  supplier: '',
  minStock: '',
  maxStock: '',
  addDate: ''
})

// 选择的值
const categoryValue = ref('')
const stockStatusValue = ref('')

// 显示的文本
const categoryDisplay = computed(() => {
  const option = categoryOptions.value.find(opt => opt.value === categoryValue.value)
  return option ? option.label : '选择原料分类'
})

const stockStatusDisplay = computed(() => {
  const option = stockStatusOptions.value.find(opt => opt.value === stockStatusValue.value)
  return option ? option.label : '选择库存状态'
})

const dateDisplay = computed(() => {
  return filterForm.addDate || '选择日期'
})

// 原料分类选项
const categoryOptions = ref([
  { label: '全部', value: '' },
  { label: '金属材料', value: 'metal' },
  { label: '塑料原料', value: 'plastic' },
  { label: '化工原料', value: 'chemical' },
  { label: '电子元件', value: 'electronic' },
  { label: '包装材料', value: 'packaging' }
])

// 库存状态选项
const stockStatusOptions = ref([
  { label: '全部', value: '' },
  { label: '库存充足', value: 'available' },
  { label: '库存紧张', value: 'limited' },
  { label: '缺货', value: 'out' }
])

// 加载状态
const loading = ref(true)

// 原料数据
const materials = ref([])

// 获取分类图标
const getCategoryIcon = (category) => {
  const iconMap = {
    'metal': 'shopping-cart',
    'plastic': 'tags',
    'chemical': 'flask',
    'electronic': 'wifi',
    'packaging': 'gift'
  }
  return iconMap[category] || 'cube'
}

// 获取分类颜色
const getCategoryColor = (category) => {
  const colorMap = {
    'metal': '#e74c3c',
    'plastic': '#3498db',
    'chemical': '#9b59b6',
    'electronic': '#f39c12',
    'packaging': '#1abc9c'
  }
  return colorMap[category] || '#95a5a6'
}

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    'available': '库存充足',
    'limited': '库存紧张',
    'out': '缺货'
  }
  return statusMap[status] || '未知'
}

// 获取状态类型
const getStatusType = (status) => {
  const typeMap = {
    'available': 'success',
    'limited': 'warning',
    'out': 'error'
  }
  return typeMap[status] || 'info'
}

// 切换筛选面板显示
const toggleFilterPanel = () => {
  showFilterPanel.value = !showFilterPanel.value
}

// 处理搜索
const handleSearch = () => {
  console.log('搜索关键词:', searchKeyword.value)
}

// 处理分类选择
const handleCategoryConfirm = (e) => {
  const selected = e.value[0]
  categoryValue.value = selected.value
  showCategoryPicker.value = false
  handleFilterChange()
}

// 处理库存状态选择
const handleStockStatusConfirm = (e) => {
  const selected = e.value[0]
  stockStatusValue.value = selected.value
  showStockStatusPicker.value = false
  handleFilterChange()
}

// 处理日期选择
const handleDateConfirm = (e) => {
  // 格式化日期为 YYYY-MM-DD
  const date = new Date(e.value)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  filterForm.addDate = `${year}-${month}-${day}`
  showDatePicker.value = false
  handleFilterChange()
}

// 处理筛选条件变化
const handleFilterChange = () => {
  console.log('筛选条件变化:', { ...filterForm, category: categoryValue.value, stockStatus: stockStatusValue.value })
}

// 应用筛选
const handleFilter = () => {
  console.log('应用筛选条件:', { ...filterForm, category: categoryValue.value, stockStatus: stockStatusValue.value })
}

// 重置筛选条件
const resetFilters = () => {
  Object.keys(filterForm).forEach(key => {
    filterForm[key] = ''
  })
  categoryValue.value = ''
  stockStatusValue.value = ''
  searchKeyword.value = ''
  loadMaterials()
}

// 处理列表项点击
const handleItemClick = (material) => {
  uni.showToast({
    title: `点击了 ${material.name}`,
    icon: 'none'
  })
}

// 处理新增原料
const handleAddMaterial = () => {
  uni.showToast({
    title: '点击了新增原料',
    icon: 'none'
  })
}

// 是否有激活的筛选条件
const hasActiveFilters = computed(() => {
  return Object.values(filterForm).some(value => value !== '') || 
         categoryValue.value !== '' || 
         stockStatusValue.value !== '' || 
         searchKeyword.value !== ''
})

// 筛选后的原料列表
const filteredMaterials = computed(() => {
  if (!materials.value.length) return []
  
  let result = [...materials.value]
  
  // 关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(material => 
      material.name.toLowerCase().includes(keyword) || 
      material.code.toLowerCase().includes(keyword)
    )
  }
  
  // 分类筛选
  if (categoryValue.value) {
    result = result.filter(material => material.categoryValue === categoryValue.value)
  }
  
  // 供应商筛选
  if (filterForm.supplier) {
    result = result.filter(material => 
      material.supplier.toLowerCase().includes(filterForm.supplier.toLowerCase())
    )
  }
  
  // 库存状态筛选
  if (stockStatusValue.value) {
    result = result.filter(material => material.stockStatus === stockStatusValue.value)
  }
  
  // 最小库存筛选
  if (filterForm.minStock) {
    result = result.filter(material => material.stock >= parseInt(filterForm.minStock))
  }
  
  // 最大库存筛选
  if (filterForm.maxStock) {
    result = result.filter(material => material.stock <= parseInt(filterForm.maxStock))
  }
  
  // 添加时间筛选
  if (filterForm.addDate) {
    result = result.filter(material => material.addTime.includes(filterForm.addDate))
  }
  
  return result
})

// 加载原料数据
const loadMaterials = () => {
  loading.value = true
  
  // 模拟API请求
  setTimeout(() => {
    materials.value = [
      {
        id: 1,
        name: '不锈钢板',
        code: 'MAT001',
        category: '金属材料',
        categoryValue: 'metal',
        supplier: '华东钢材有限公司',
        stock: 1500,
        unit: '吨',
        stockStatus: 'available',
        addTime: '2023-05-10'
      },
      {
        id: 2,
        name: 'ABS塑料',
        code: 'MAT002',
        category: '塑料原料',
        categoryValue: 'plastic',
        supplier: '华南化工集团',
        stock: 800,
        unit: '千克',
        stockStatus: 'limited',
        addTime: '2023-06-15'
      },
      {
        id: 3,
        name: '硫酸',
        code: 'MAT003',
        category: '化工原料',
        categoryValue: 'chemical',
        supplier: '北方化学制品厂',
        stock: 0,
        unit: '升',
        stockStatus: 'out',
        addTime: '2023-04-22'
      },
      {
        id: 4,
        name: '电阻',
        code: 'MAT004',
        category: '电子元件',
        categoryValue: 'electronic',
        supplier: '深圳电子元器件',
        stock: 10000,
        unit: '个',
        stockStatus: 'available',
        addTime: '2023-07-05'
      },
      {
        id: 5,
        name: '纸箱',
        code: 'MAT005',
        category: '包装材料',
        categoryValue: 'packaging',
        supplier: '华东包装制品',
        stock: 5000,
        unit: '个',
        stockStatus: 'available',
        addTime: '2023-06-30'
      },
      {
        id: 6,
        name: '铜线',
        code: 'MAT006',
        category: '金属材料',
        categoryValue: 'metal',
        supplier: '华东钢材有限公司',
        stock: 200,
        unit: '卷',
        stockStatus: 'limited',
        addTime: '2023-07-12'
      }
    ]
    loading.value = false
  }, 800)
}

// 初始化加载数据
onMounted(() => {
  loadMaterials()
})
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f1 100%);
  min-height: 100vh;
}

.search-section {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
  padding: 0 10rpx;
}

.filter-toggle {
  margin-left: 20rpx;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-panel {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10px);
  border: 1rpx solid rgba(255, 255, 255, 0.5);
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 30rpx;
}

.filter-item {
  flex: 1;
  min-width: 200rpx;
  margin-right: 20rpx;
  margin-bottom: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.filter-label {
  display: block;
  margin-bottom: 16rpx;
  font-size: 28rpx;
  color: #606266;
  font-weight: 500;
  line-height: 1.4;
}

.picker-wrapper {
  width: 100%;
  display: flex;
  align-items: center;
}

.filter-actions {
  display: flex;
  justify-content: center;
  margin-top: 20rpx;
  gap: 20rpx;
  align-items: center;
}

.list-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10px);
  border: 1rpx solid rgba(255, 255, 255, 0.5);
  margin-bottom: 100rpx;
}

.list-item {
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:active {
    background-color: #f8f9fa;
    transform: scale(0.99);
  }
}

.item-left {
  margin-right: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-icon {
  width: 48rpx;
  height: 48rpx;
  border-radius: 12rpx;
  background-color: #f0f2f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.item-name {
  font-weight: 600;
  font-size: 32rpx;
  margin-bottom: 16rpx;
  color: #303133;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  line-height: 1.4;
}

.item-code {
  font-size: 24rpx;
  color: #909399;
  margin-left: 10rpx;
  font-weight: normal;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.detail-item {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  color: #606266;
  line-height: 1.4;
}

.detail-text {
  margin-left: 10rpx;
}

.item-right {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 20rpx;
}

.item-right ::v-deep .u-tag__content{
  display: flex;
  align-items: center;
}

.loading {
  text-align: center;
  padding: 60rpx 20rpx;
  color: #909399;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-state {
  padding: 80rpx 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.empty-tip {
  display: block;
  text-align: center;
  margin-top: 20rpx;
  color: #909399;
  font-size: 26rpx;
  line-height: 1.4;
}

.reset-link {
  color: #2979ff;
  text-decoration: underline;
}

.footer-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1rpx solid #e0e0e0;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 响应式适配 */
@media (max-width: 750px) {
  .filter-row {
    flex-direction: column;
  }
  
  .filter-item {
    margin-right: 0;
    width: 100%;
  }
  
  .search-section {
    flex-direction: column;
    gap: 20rpx;
  }
  
  .filter-toggle {
    margin-left: 0;
    width: 100%;
  }
  
  .filter-actions {
    flex-direction: column;
  }
  
  .list-item {
    align-items: flex-start;
  }
}
</style> 