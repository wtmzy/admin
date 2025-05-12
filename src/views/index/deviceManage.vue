<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { reactive, ref } from 'vue'
import regionData from './regionData.json'

defineOptions({
  name: 'DeviceManage',
})

// 设备接口定义
interface Device {
  deviceId: string
  deviceType: string
  hardwareVersion: string
  softwareVersion: string
  productionPlace: string
  factoryDate: string
  projectDate: string
  maintenanceDate: string
  owner: string
  installProvince: string
  installCity: string
  usage: string
  isObsolete?: boolean
}

// 地区树数据
const regionTreeData = ref(regionData)

// 选中的地区
const selectedRegion = ref('all')

// 搜索表单
const searchForm = reactive({
  userPhone: '',
  deviceType: '',
})

// 表格数据 - 示例数据
const tableData = ref<Device[]>([
  {
    deviceId: 'DEV20231001',
    deviceType: 'A100',
    hardwareVersion: 'V1.2',
    softwareVersion: 'V2.3.5',
    productionPlace: '深圳',
    factoryDate: '2023-06-15',
    projectDate: '2023-07-01',
    maintenanceDate: '2023-12-31',
    owner: '张三',
    installProvince: '广东省',
    installCity: '深圳市',
    usage: '家用',
    isObsolete: false,
  },
  {
    deviceId: 'DEV20231002',
    deviceType: 'B200',
    hardwareVersion: 'V1.3',
    softwareVersion: 'V2.4.0',
    productionPlace: '上海',
    factoryDate: '2023-05-20',
    projectDate: '2023-06-10',
    maintenanceDate: '2023-11-30',
    owner: '李四',
    installProvince: '上海市',
    installCity: '浦东新区',
    usage: '商用',
    isObsolete: false,
  },
])
const loading = ref(false)

// 分页配置
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 2, // 示例数据数量
})

// 详情对话框
const detailDialogVisible = ref(false)
const currentDeviceDetail = ref<Device>({} as Device)

// 打开详情对话框
const openDetailDialog = (row: Device) => {
  currentDeviceDetail.value = { ...row }
  detailDialogVisible.value = true
}

// 设备报废处理
const handleDeviceScrap = (row: Device) => {
  ElMessageBox.confirm(`确定要报废设备 ${row.deviceId} 吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // 找到设备并更新状态
      const device = tableData.value.find((item) => item.deviceId === row.deviceId)
      if (device) {
        device.isObsolete = true
        ElMessage.success('设备已成功报废')
      }
    })
    .catch(() => {
      // 取消操作
    })
}

// 搜索方法
const handleSearch = () => {
  loading.value = true
  // 模拟请求
  setTimeout(() => {
    loading.value = false
    ElMessage.success('查询成功')
  }, 500)
}

// 重置方法
const handleReset = () => {
  searchForm.userPhone = ''
  searchForm.deviceType = ''
}

const deviceDialogVisible = ref(false)
const deviceForm = reactive({
  deviceId: '',
  deviceType: '',
  hardwareVersion: '',
  softwareVersion: '',
  productionPlace: '',
})
const deviceFormRules = {
  deviceId: [{ required: true, message: '请输入设备Id', trigger: 'blur' }],
  deviceType: [{ required: true, message: '请输入设备型号', trigger: 'blur' }],
  hardwareVersion: [{ required: true, message: '请输入硬件版本', trigger: 'blur' }],
  softwareVersion: [{ required: true, message: '请输入软件版本', trigger: 'blur' }],
  productionPlace: [{ required: true, message: '请输入产地', trigger: 'blur' }],
}
const deviceFormRef = ref<FormInstance | null>(null)

const handleDeviceRegister = () => {
  deviceDialogVisible.value = true
}
const handleDeviceDialogConfirm = () => {
  if (!deviceFormRef.value) return

  deviceFormRef.value.validate((valid: boolean) => {
    if (valid) {
      // 创建新设备对象
      const newDevice: Device = {
        ...deviceForm,
        // 添加表格中其他需要的字段，设为默认值
        factoryDate: new Date().toISOString().split('T')[0], // 当前日期作为出厂日期
        projectDate: '',
        maintenanceDate: '',
        owner: '',
        installProvince: '',
        installCity: '',
        usage: '',
        isObsolete: false,
      }

      // 添加到表格数据
      tableData.value.unshift(newDevice)

      // 更新总数
      pagination.total += 1

      // 关闭弹框
      deviceDialogVisible.value = false

      // 重置表单 - 修复类型错误
      deviceForm.deviceId = ''
      deviceForm.deviceType = ''
      deviceForm.hardwareVersion = ''
      deviceForm.softwareVersion = ''
      deviceForm.productionPlace = ''

      // 提示成功
      ElMessage.success('设备注册成功')
    }
  })
}
const handleDeviceDialogCancel = () => {
  deviceDialogVisible.value = false
}

// 处理页码变化
const handleCurrentChange = (val: number) => {
  pagination.currentPage = val
  handleSearch()
}

// 处理每页条数变化
const handleSizeChange = (val: number) => {
  pagination.pageSize = val
  pagination.currentPage = 1
  handleSearch()
}
</script>

<template>
  <div class="device-manage-container">
    <!-- 左侧区域树 -->
    <div class="region-tree-container">
      <div class="region-title">地区选择</div>
      <el-tree
        :current-node-key="selectedRegion"
        :data="regionTreeData"
        default-expand-all
        highlight-current
        node-key="value"
        :props="{ children: 'children', label: 'label' }"
        style="width: 160px"
        @node-click="(data) => (selectedRegion = data.value)"
      />
    </div>

    <!-- 右侧内容区 -->
    <div class="content-container">
      <!-- 搜索区域 -->
      <div class="search-container">
        <el-form class="search-form" :inline="true" :model="searchForm">
          <el-form-item label="用户手机号:">
            <el-input v-model="searchForm.userPhone" clearable placeholder="请输入手机号码" />
          </el-form-item>
          <el-form-item label="设备型号:">
            <el-input v-model="searchForm.deviceType" clearable placeholder="请输入设备型号" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              <el-icon><component :is="Search" /></el-icon>
              搜索
            </el-button>
            <el-button @click="handleReset">重置</el-button>
            <el-button type="success" @click="handleDeviceRegister">设备注册</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 表格区域 -->
      <div class="table-container">
        <el-table v-loading="loading" :data="tableData" height="64vh" stripe style="width: 100%">
          <el-table-column label="设备id" min-width="120" prop="deviceId" />
          <el-table-column label="设备型号" min-width="120" prop="deviceType" />
          <el-table-column label="硬件版本" min-width="120" prop="hardwareVersion" />
          <el-table-column label="软件版本" min-width="120" prop="softwareVersion" />
          <el-table-column label="产地" min-width="100" prop="productionPlace" />
          <el-table-column label="出厂日期" min-width="120" prop="factoryDate" />
          <el-table-column label="激活日期" min-width="120" prop="projectDate" />
          <el-table-column label="保修到期日" min-width="120" prop="maintenanceDate" />
          <el-table-column label="所属用户" min-width="120" prop="owner" />
          <el-table-column label="安装省份" min-width="120" prop="installProvince" />
          <el-table-column label="安装城市" min-width="120" prop="installCity" />
          <el-table-column label="用途" min-width="100" prop="usage" />
          <el-table-column label="是否报废" min-width="100">
            <template #default="scope">
              <el-tag :type="scope.row.isObsolete ? 'danger' : 'success'">
                {{ scope.row.isObsolete ? '已报废' : '正常' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" min-width="120">
            <template #default="scope">
              <el-button link size="small" type="primary" @click="openDetailDialog(scope.row)">详情</el-button>
              <el-button v-if="!scope.row.isObsolete" link size="small" type="danger" @click="handleDeviceScrap(scope.row)">
                设备报废
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 暂无数据提示 -->
        <div v-if="tableData.length === 0 && !loading" class="empty-tip">暂无数据</div>

        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="pagination.currentPage"
            v-model:page-size="pagination.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[10, 20, 50, 100]"
            :total="pagination.total"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          />
        </div>
      </div>
    </div>

    <!-- 设备注册对话框 -->
    <el-dialog
      v-model="deviceDialogVisible"
      :close-on-click-modal="false"
      title="输入设备出厂信息"
      width="500px"
      @close="handleDeviceDialogCancel"
    >
      <el-form ref="deviceFormRef" label-width="90px" :model="deviceForm" :rules="deviceFormRules" style="padding-right: 20px">
        <el-form-item label="设备Id" prop="deviceId">
          <el-input v-model="deviceForm.deviceId" placeholder="请输入设备Id" />
        </el-form-item>
        <el-form-item label="设备型号" prop="deviceType">
          <el-input v-model="deviceForm.deviceType" placeholder="请输入设备型号" />
        </el-form-item>
        <el-form-item label="硬件版本" prop="hardwareVersion">
          <el-input v-model="deviceForm.hardwareVersion" placeholder="请输入硬件版本" />
        </el-form-item>
        <el-form-item label="软件版本" prop="softwareVersion">
          <el-input v-model="deviceForm.softwareVersion" placeholder="请输入软件版本" />
        </el-form-item>
        <el-form-item label="产地" prop="productionPlace">
          <el-input v-model="deviceForm.productionPlace" placeholder="请输入产地" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleDeviceDialogCancel">取消</el-button>
        <el-button type="primary" @click="handleDeviceDialogConfirm">确定</el-button>
      </template>
    </el-dialog>

    <!-- 详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="设备详情" width="600px">
      <el-descriptions border :column="2">
        <el-descriptions-item label="设备ID">{{ currentDeviceDetail.deviceId }}</el-descriptions-item>
        <el-descriptions-item label="设备型号">{{ currentDeviceDetail.deviceType }}</el-descriptions-item>
        <el-descriptions-item label="硬件版本">{{ currentDeviceDetail.hardwareVersion }}</el-descriptions-item>
        <el-descriptions-item label="软件版本">{{ currentDeviceDetail.softwareVersion }}</el-descriptions-item>
        <el-descriptions-item label="产地">{{ currentDeviceDetail.productionPlace }}</el-descriptions-item>
        <el-descriptions-item label="出厂日期">{{ currentDeviceDetail.factoryDate }}</el-descriptions-item>
        <el-descriptions-item label="激活日期">{{ currentDeviceDetail.projectDate }}</el-descriptions-item>
        <el-descriptions-item label="保修到期日">{{ currentDeviceDetail.maintenanceDate }}</el-descriptions-item>
        <el-descriptions-item label="所属用户">{{ currentDeviceDetail.owner }}</el-descriptions-item>
        <el-descriptions-item label="安装省份">{{ currentDeviceDetail.installProvince }}</el-descriptions-item>
        <el-descriptions-item label="安装城市">{{ currentDeviceDetail.installCity }}</el-descriptions-item>
        <el-descriptions-item label="用途">{{ currentDeviceDetail.usage }}</el-descriptions-item>
        <el-descriptions-item label="设备状态">
          <el-tag :type="currentDeviceDetail.isObsolete ? 'danger' : 'success'">
            {{ currentDeviceDetail.isObsolete ? '已报废' : '正常' }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.device-manage-container {
  display: flex;
  width: 100%;
  height: 100%;
  padding: 10px;

  .region-tree-container {
    width: 200px;
    height: 80vh;
    padding: 10px;
    margin-right: 10px;
    overflow-y: auto;
    border-right: 1px solid #e4e7ed;
    border-radius: 4px;

    .region-title {
      width: 100%;
      padding: 10px 0;
      margin-bottom: 10px;
      font-size: 16px;
      font-weight: bold;
      border-bottom: 1px solid #e4e7ed;
    }
  }

  .content-container {
    width: 100%;
    height: 100%;
  }

  .search-container {
    width: 100%;
    padding: 15px;
    margin-bottom: 10px;
    border-radius: 4px;

    .search-form {
      display: flex;
      flex-wrap: wrap;
    }
  }

  .table-container {
    position: relative;
    box-sizing: border-box;
    display: flex;
    flex: 1;
    flex-direction: column;
    width: 100%;
    padding: 15px;
    border-radius: 4px;

    .empty-tip {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100px;
      font-size: 14px;
      color: #909399;
    }
  }

  .pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 15px;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}
</style>
