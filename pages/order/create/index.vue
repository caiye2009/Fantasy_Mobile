<template>
  <view class="container">
    <!-- 顶部导航 -->
    <u-navbar
      title="新建布匹订单"
      :autoBack="true"
      bgColor="#3498db"
      titleStyle="color: white; font-size: 16px;"
      leftIconColor="white"
    ></u-navbar>

    <!-- 步骤指示器 -->
    <u-steps :current="currentStep" activeColor="#3c9cff" class="steps">
      <u-steps-item title="基本信息"></u-steps-item>
      <u-steps-item title="布匹详情"></u-steps-item>
      <u-steps-item title="数量价格"></u-steps-item>
      <u-steps-item title="确认提交"></u-steps-item>
    </u-steps>

    <!-- 步骤内容 -->
    <scroll-view scroll-y class="step-content">
      <!-- 步骤1: 基本信息 -->
      <view v-if="currentStep === 0" class="step-panel">
        <view class="step-title">基本信息</view>

        <u-form :model="formData.step1" ref="step1Form" class="form">
          <u-form-item label="客户名称" prop="customerId" labelWidth="120" required>
            <view class="search-select">
              <u-input
                v-model="searchCustomer"
                placeholder="输入客户名称搜索"
                @input="handleCustomerSearch"
                @focus="showCustomerDropdown = true"
                border="none"
                clearable
              ></u-input>
              <view v-if="showCustomerDropdown && filteredCustomers.length" class="dropdown-list">
                <view
                  v-for="item in filteredCustomers"
                  :key="item.id"
                  class="dropdown-item"
                  @click="selectCustomerFromList(item)"
                >
                  {{ item.name }}
                </view>
              </view>
              <view v-if="showCustomerDropdown && searchCustomer && !filteredCustomers.length" class="no-results">
                未找到匹配的客户
              </view>
            </view>
            <text v-if="formData.step1.customerName" class="selected-value">
              已选: {{ formData.step1.customerName }}
            </text>
          </u-form-item>

          <u-form-item label="订单类型" prop="orderType" labelWidth="120" required>
            <u-radio-group v-model="formData.step1.orderType" placement="row">
              <u-radio label="新订单" name="new"></u-radio>
              <u-radio label="返单" name="repeat"></u-radio>
            </u-radio-group>
          </u-form-item>

          <u-form-item label="紧急程度" prop="urgency" labelWidth="120" required>
            <view class="urgency-group">
              <view
                v-for="item in urgencyOptions"
                :key="item.value"
                class="urgency-option"
                :class="{ active: formData.step1.urgency === item.value }"
                @click="formData.step1.urgency = item.value"
              >
                <text>{{ item.label }}</text>
              </view>
            </view>
          </u-form-item>
        </u-form>
      </view>

      <!-- 步骤2: 布匹详情 -->
      <view v-if="currentStep === 1" class="step-panel">
        <view class="step-title">布匹详情</view>

        <u-form :model="formData.step2" ref="step2Form" class="form">
          <u-form-item label="布料类型" prop="fabricType" labelWidth="120" required>
            <view class="search-select">
              <u-input
                v-model="searchFabric"
                placeholder="输入布料名称搜索"
                @input="handleFabricSearch"
                @focus="showFabricDropdown = true"
                border="none"
                clearable
              ></u-input>
              <view v-if="showFabricDropdown && filteredFabrics.length" class="dropdown-list">
                <view
                  v-for="item in filteredFabrics"
                  :key="item.code"
                  class="dropdown-item"
                  @click="selectFabricFromList(item)"
                >
                  {{ item.name }}
                </view>
              </view>
              <view v-if="showFabricDropdown && searchFabric && !filteredFabrics.length" class="no-results">
                未找到匹配的布料
              </view>
            </view>
            <text v-if="formData.step2.fabricName" class="selected-value">
              已选: {{ formData.step2.fabricName }}
            </text>
          </u-form-item>

          <u-form-item label="颜色" prop="color" labelWidth="120" required>
            <u-radio-group v-model="formData.step2.color">
              <u-radio v-for="c in colors" :key="c" :label="c" :name="c"></u-radio>
            </u-radio-group>
          </u-form-item>

          <u-form-item label="工艺要求" prop="process" labelWidth="120">
            <u-checkbox-group v-model="formData.step2.process">
              <u-checkbox v-for="p in processes" :key="p.value" :name="p.value">{{ p.label }}</u-checkbox>
            </u-checkbox-group>
          </u-form-item>
        </u-form>
      </view>

      <!-- 步骤3: 数量价格 -->
      <view v-if="currentStep === 2" class="step-panel">
        <view class="step-title">数量与价格</view>

        <u-form :model="formData.step3" ref="step3Form" class="form">
          <u-form-item label="数量(米)" prop="quantity" labelWidth="120" required>
            <u-input v-model="formData.step3.quantity" type="number" placeholder="请输入数量" border="none"></u-input>
          </u-form-item>

          <u-form-item label="单价(元)" prop="price" labelWidth="120" required>
            <u-input v-model="formData.step3.price" type="digit" placeholder="请输入单价" border="none"></u-input>
          </u-form-item>

          <u-form-item label="总价" labelWidth="120">
            <text class="total-price">¥{{ calculateTotalPrice() }}</text>
          </u-form-item>

          <u-form-item label="交货日期" prop="deliveryDate" labelWidth="120" required>
            <u-datetime-picker
              v-model="formData.step3.deliveryDate"
              mode="date"
              :min-date="minDate"
              @confirm="handleDateConfirm"
            ></u-datetime-picker>
            <view class="date-display">
              {{ formatDate(formData.step3.deliveryDate) }}
            </view>
          </u-form-item>
        </u-form>
      </view>

      <!-- 步骤4: 确认信息 -->
      <view v-if="currentStep === 3" class="step-panel">
        <view class="step-title">确认订单信息</view>

        <u-card :title="formData.step1.customerName || '未选择客户'" class="summary-card">
          <view class="summary-section">
            <text class="section-title">基本信息</text>
            <text>订单类型: {{ formData.step1.orderType === 'new' ? '新订单' : '返单' }}</text>
            <text>紧急程度: {{ urgencyMap[formData.step1.urgency] }}</text>
          </view>

          <view class="summary-section">
            <text class="section-title">布匹详情</text>
            <text>布料类型: {{ formData.step2.fabricName || '未选择' }}</text>
            <text>颜色: {{ formData.step2.color }}</text>
            <text>工艺: {{ getSelectedProcesses() }}</text>
          </view>

          <view class="summary-section">
            <text class="section-title">数量价格</text>
            <text>数量: {{ formData.step3.quantity || 0 }}米</text>
            <text>单价: ¥{{ formData.step3.price || 0 }}</text>
            <text>总价: ¥{{ calculateTotalPrice() }}</text>
            <text>交货日期: {{ formatDate(formData.step3.deliveryDate) }}</text>
          </view>
        </u-card>
      </view>
    </scroll-view>

    <!-- 底部操作栏 -->
    <view class="action-bar">
      <u-button
        v-if="currentStep > 0"
        @click="prevStep"
        type="default"
        size="medium"
        plain
      >上一步</u-button>

      <u-button
        v-if="currentStep < 3"
        @click="nextStep"
        type="primary"
        size="medium"
        :disabled="!isStepValid(currentStep)"
      >下一步</u-button>

      <u-button
        v-else
        @click="submitOrder"
        type="success"
        size="medium"
        :loading="submitting"
      >提交订单</u-button>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

// 当前步骤
const currentStep = ref(0)

// 表单数据
const formData = reactive({
  step1: {
    customerId: '',
    customerName: '',
    orderType: 'new',
    urgency: 1  // 默认选择普通
  },
  step2: {
    fabricType: '',
    fabricName: '',
    color: '白色',
    process: []
  },
  step3: {
    quantity: 100,
    price: 25.5,
    deliveryDate: Date.now() + 7 * 24 * 60 * 60 * 1000
  }
})

// 搜索相关 - 客户
const searchCustomer = ref('')
const customers = ref([
  { id: 'C001', name: '广州纺织有限公司' },
  { id: 'C002', name: '佛山服装厂' },
  { id: 'C003', name: '东莞制衣集团' },
  { id: 'C004', name: '深圳时尚服饰' },
  { id: 'C005', name: '中山布艺公司' },
  { id: 'C006', name: '惠州织造厂' },
  { id: 'C007', name: '珠海纺织贸易' }
])
const filteredCustomers = ref([...customers.value])
const showCustomerDropdown = ref(false)

// 搜索相关 - 布料
const searchFabric = ref('')
const fabrics = ref([
  { code: 'FB001', name: '纯棉面料' },
  { code: 'FB002', name: '涤纶面料' },
  { code: 'FB003', name: '混纺面料' },
  { code: 'FB004', name: '丝绸面料' },
  { code: 'FB005', name: '麻质面料' },
  { code: 'FB006', name: '羊毛面料' },
  { code: 'FB007', name: '牛仔布' }
])
const filteredFabrics = ref([...fabrics.value])
const showFabricDropdown = ref(false)

// 选项数据
const colors = ['白色', '黑色', '红色', '蓝色', '灰色', '绿色', '黄色', '紫色']
const processes = [
  { label: '防皱处理', value: 'wrinkle' },
  { label: '防水处理', value: 'waterproof' },
  { label: '阻燃处理', value: 'flame' },
  { label: '抗菌处理', value: 'antibacterial' },
  { label: '抗紫外线', value: 'uv' },
  { label: '柔软处理', value: 'soft' }
]

// 紧急程度选项
const urgencyOptions = ref([
  { label: '普通', value: 1 },
  { label: '加急', value: 2 },
  { label: '特急', value: 3 }
])

// 紧急程度映射
const urgencyMap = {
  1: '普通',
  2: '加急',
  3: '特急'
}

// 最小日期（今天）
const minDate = Date.now()

// 提交状态
const submitting = ref(false)

// 搜索客户 - 实时筛选
const handleCustomerSearch = () => {
  if (searchCustomer.value) {
    filteredCustomers.value = customers.value.filter(c =>
      c.name.includes(searchCustomer.value)
    )
  } else {
    filteredCustomers.value = [...customers.value]
  }
  showCustomerDropdown.value = true
}

// 从列表中选择客户
const selectCustomerFromList = (item) => {
  formData.step1.customerId = item.id
  formData.step1.customerName = item.name
  searchCustomer.value = item.name
  showCustomerDropdown.value = false
}

// 搜索布料 - 实时筛选
const handleFabricSearch = () => {
  if (searchFabric.value) {
    filteredFabrics.value = fabrics.value.filter(f =>
      f.name.includes(searchFabric.value)
    )
  } else {
    filteredFabrics.value = [...fabrics.value]
  }
  showFabricDropdown.value = true
}

// 从列表中选择布料
const selectFabricFromList = (item) => {
  formData.step2.fabricType = item.code
  formData.step2.fabricName = item.name
  searchFabric.value = item.name
  showFabricDropdown.value = false
}

// 日期处理
const handleDateConfirm = (e) => {
  formData.step3.deliveryDate = e.value
}

// 表单验证状态
const isStepValid = (step) => {
  switch(step) {
    case 0:
      return !!formData.step1.customerId &&
             formData.step1.urgency >= 1 &&
             formData.step1.urgency <= 3
    case 1:
      return !!formData.step2.fabricType
    case 2:
      return formData.step3.quantity > 0 &&
             formData.step3.price > 0 &&
             formData.step3.deliveryDate > Date.now()
    default:
      return true
  }
}

// 步骤导航
const nextStep = () => {
  if (currentStep.value < 3 && isStepValid(currentStep.value)) {
    currentStep.value++
  } else {
    let message = '请完成当前步骤必填项'
    if (currentStep.value === 0) {
      if (!formData.step1.customerId) {
        message = '请选择客户'
      } else if (!(formData.step1.urgency >= 1 && formData.step1.urgency <= 3)) {
        message = '请选择紧急程度'
      }
    } else if (currentStep.value === 1 && !formData.step2.fabricType) {
      message = '请选择布料类型'
    } else if (currentStep.value === 2) {
      if (formData.step3.quantity <= 0) message = '数量必须大于0'
      else if (formData.step3.price <= 0) message = '价格必须大于0'
      else if (formData.step3.deliveryDate <= Date.now()) message = '交货日期必须是未来日期'
    }

    uni.showToast({
      title: message,
      icon: 'none'
    })
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

// 辅助函数
const formatDate = (timestamp) => {
  if (!timestamp) return '未选择'
  const date = new Date(timestamp)
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
}

const calculateTotalPrice = () => {
  if (!formData.step3.quantity || !formData.step3.price) return '0.00'
  return (formData.step3.quantity * formData.step3.price).toFixed(2)
}

const getSelectedProcesses = () => {
  if (!formData.step2.process.length) return '无'
  return formData.step2.process.map(p => {
    const process = processes.find(proc => proc.value === p)
    return process ? process.label : p
  }).join('、')
}

// 提交订单
const submitOrder = () => {
  submitting.value = true

  // 模拟API请求
  setTimeout(() => {
    uni.showToast({
      title: '订单创建成功',
      icon: 'success'
    })
    submitting.value = false

    // 重置表单或跳转页面
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  }, 1500)
}

// 点击页面其他区域关闭下拉框
const closeDropdowns = (e) => {
  if (!e.target.closest('.search-select')) {
    showCustomerDropdown.value = false
    showFabricDropdown.value = false
  }
}

// 初始化
onMounted(() => {
  // 添加全局点击事件监听器
  document.addEventListener('click', closeDropdowns)
})
</script>

<style lang="scss">
page {
  background-color: #f5f7fa;
  height: 100%;
  font-size: 14px;
}

.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f7fa;
  position: relative;
}

.steps {
  padding: 20rpx 30rpx;
  background: white;
  position: sticky;
  top: 0;
  z-index: 10;
}

.step-content {
  flex: 1;
  padding: 20rpx;
  overflow-y: auto;
}

.step-panel {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.03);

  .step-title {
    font-size: 34rpx;
    font-weight: 500;
    margin-bottom: 30rpx;
    color: #2c3e50;
    position: relative;
    padding-left: 20rpx;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      height: 36rpx;
      width: 8rpx;
      background-color: #3498db;
      border-radius: 4rpx;
    }
  }
}

.form {
  .u-form-item {
    padding: 20rpx 0;
    border-bottom: 1rpx solid #f1f1f1;
    position: relative;
  }

  .selected-value {
    display: block;
    margin-top: 15rpx;
    color: #3498db;
    font-size: 26rpx;
  }

  .total-price {
    font-size: 36rpx;
    font-weight: bold;
    color: #e74c3c;
  }

  .date-display {
    padding: 20rpx;
    background-color: #f8f8f8;
    border-radius: 8rpx;
    text-align: center;
    margin-top: 15rpx;
    font-size: 28rpx;
    color: #666;
  }

  .u-radio-group, .u-checkbox-group {
    display: flex;
    flex-wrap: wrap;
    gap: 30rpx;
  }

  .u-checkbox, .u-radio {
    margin-right: 0 !important;
  }

  /* 紧急程度样式 */
  .urgency-group {
    display: flex;
    gap: 20rpx;
    margin-top: 10rpx;
  }

  .urgency-option {
    flex: 1;
    padding: 20rpx;
    border: 1rpx solid #dcdfe6;
    border-radius: 8rpx;
    text-align: center;
    font-size: 28rpx;
    color: #606266;
    background-color: #f5f7fa;
    transition: all 0.3s;

    &.active {
      border-color: #3c9cff;
      background-color: #ecf5ff;
      color: #3c9cff;
      font-weight: 500;
    }
  }

  /* 搜索选择样式 */
  .search-select {
    position: relative;
    width: 100%;

    .dropdown-list {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      max-height: 300rpx;
      overflow-y: auto;
      background: white;
      border: 1rpx solid #eee;
      border-radius: 8rpx;
      box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
      z-index: 100;
      margin-top: 10rpx;

      .dropdown-item {
        padding: 20rpx;
        font-size: 28rpx;
        border-bottom: 1rpx solid #f5f5f5;
        transition: background 0.2s;

        &:last-child {
          border-bottom: none;
        }

        &:hover {
          background-color: #f5f7fa;
        }
      }
    }

    .no-results {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      padding: 20rpx;
      background: white;
      border: 1rpx solid #eee;
      border-radius: 8rpx;
      box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
      z-index: 100;
      margin-top: 10rpx;
      text-align: center;
      color: #999;
      font-size: 28rpx;
    }
  }
}

.action-bar {
  display: flex;
  justify-content: space-between;
  padding: 20rpx 30rpx;
  background: white;
  border-top: 1rpx solid #eee;
  position: sticky;
  bottom: 0;

  button {
    flex: 1;
    margin: 0 15rpx;
  }
}

.summary-card {
  .u-card__head {
    background-color: #f8fafc;
    font-weight: bold;
  }

  .summary-section {
    margin-bottom: 30rpx;
    padding-bottom: 20rpx;
    border-bottom: 1rpx dashed #eee;

    .section-title {
      font-weight: bold;
      display: block;
      margin-bottom: 15rpx;
      font-size: 30rpx;
      color: #3498db;
    }

    text {
      display: block;
      line-height: 1.8;
      color: #555;
      font-size: 28rpx;
    }
  }
}
</style>