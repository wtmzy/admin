<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { reactive, ref } from 'vue'
import regionData from './regionData.json'

defineOptions({
  name: 'UserManage',
})

// 用户数据接口
interface User {
  phoneNumber: string
  region: string
  userGroup: string
  registerTime: string
  lastLoginTime: string
  deviceNumber: number
  securityScore: number
  removedDevices: number
  unprocessedCount: number
  processingOrders: number
}

// 地区树数据
const regionTreeData = ref(regionData)

// 选中的地区
const selectedRegion = ref('all')

// 搜索表单
const searchForm = reactive({
  phoneNumber: '',
  userGroup: '',
  isProcessed: '否',
})

// 表格数据 - 添加示例数据
const tableData = ref<User[]>([
  {
    phoneNumber: '13800138000',
    region: '北京市',
    userGroup: '普通用户',
    registerTime: '2023-05-20 10:30:00',
    lastLoginTime: '2023-10-15 08:45:22',
    deviceNumber: 2,
    securityScore: 85,
    removedDevices: 1,
    unprocessedCount: 3,
    processingOrders: 1,
  },
  {
    phoneNumber: '13900139000',
    region: '上海市',
    userGroup: 'VIP用户',
    registerTime: '2022-12-10 14:20:10',
    lastLoginTime: '2023-10-16 15:22:45',
    deviceNumber: 3,
    securityScore: 92,
    removedDevices: 0,
    unprocessedCount: 0,
    processingOrders: 0,
  },
])
const loading = ref(false)

// 分页配置
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 2, // 设置为示例数据的数量
})

// 详情对话框
const detailDialogVisible = ref(false)
const currentRowDetail = ref<User>({} as User)

// 打开详情对话框
const openDetailDialog = (row: User) => {
  currentRowDetail.value = { ...row }
  detailDialogVisible.value = true
}

// 通知对话框
const notificationDialogVisible = ref(false)
const notificationForm = reactive({
  type: '',
  title: '',
  content: '',
})
const notificationFormRef = ref<FormInstance | null>(null)

// 打开通知对话框
const openNotificationDialog = (row: User) => {
  currentRowDetail.value = { ...row }
  notificationForm.type = ''
  notificationForm.title = ''
  notificationForm.content = ''
  notificationDialogVisible.value = true
}

// 通知类型选项
const notificationTypes = [
  { label: '系统通知', value: 'system' },
  { label: '活动通知', value: 'activity' },
  { label: '安全通知', value: 'security' },
]

// 提交通知
const submitNotification = async () => {
  if (!notificationFormRef.value) return

  await notificationFormRef.value.validate((valid: boolean) => {
    if (valid) {
      // 这里添加发送通知的逻辑
      ElMessage.success(`成功向 ${currentRowDetail.value.phoneNumber} 发送通知`)
      notificationDialogVisible.value = false
    }
  })
}

// 用户信息编辑对话框
const editUserDialogVisible = ref(false)
const editUserForm = reactive({
  username: '',
  userType: '',
  phoneNumber: '',
  province: '',
  city: '',
})
const editUserFormRef = ref<FormInstance | null>(null)

// 用户类型选项
const userTypes = [
  { label: '普通用户', value: 'normal' },
  { label: 'VIP用户', value: 'vip' },
  { label: '企业用户', value: 'enterprise' },
]

// 打开用户编辑对话框
const openEditUserDialog = (row: User) => {
  currentRowDetail.value = { ...row }
  // 模拟用户名
  editUserForm.username = `${row.phoneNumber.substring(0, 3)}****${row.phoneNumber.substring(7)}`
  editUserForm.userType = row.userGroup === 'VIP用户' ? 'vip' : 'normal'
  editUserForm.phoneNumber = row.phoneNumber

  // 从地区中提取省份和城市（假设格式为"省份市"）
  const regionParts = row.region.match(/(.*?)(市|省|自治区)(.*)/)
  if (regionParts) {
    editUserForm.province = regionParts[1] + regionParts[2]
    editUserForm.city = regionParts[3] || ''
  } else {
    editUserForm.province = row.region
    editUserForm.city = ''
  }

  editUserDialogVisible.value = true
}

// 提交用户编辑
const submitUserEdit = async () => {
  if (!editUserFormRef.value) return

  await editUserFormRef.value.validate((valid: boolean) => {
    if (valid) {
      // 这里添加更新用户信息的逻辑
      ElMessage.success('用户信息修改成功')
      editUserDialogVisible.value = false
    }
  })
}

// 删除用户
const handleDelete = (row: User) => {
  ElMessageBox.confirm(`确定要删除用户 ${row.phoneNumber} 的信息吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // 这里添加删除用户的逻辑
      tableData.value = tableData.value.filter((item) => item.phoneNumber !== row.phoneNumber)
      ElMessage.success('删除成功')
    })
    .catch(() => {
      // 取消删除
    })
}

// 用户表单校验规则
const editUserRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  userType: [{ required: true, message: '请选择用户类型', trigger: 'change' }],
  phoneNumber: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' },
  ],
  province: [{ required: true, message: '请选择省份', trigger: 'change' }],
}

// 通知表单校验规则
const notificationRules = {
  type: [{ required: true, message: '请选择通知类型', trigger: 'change' }],
  title: [{ required: true, message: '请输入通知标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入通知内容', trigger: 'blur' }],
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
  searchForm.phoneNumber = ''
  searchForm.userGroup = ''
  searchForm.isProcessed = '否'
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
  <div class="user-manage-container">
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
          <el-form-item label="手机号码:">
            <el-input v-model="searchForm.phoneNumber" clearable placeholder="请输入手机号码" />
          </el-form-item>
          <el-form-item label="用户群组:">
            <el-input v-model="searchForm.userGroup" clearable placeholder="请输入用户群组" />
          </el-form-item>
          <el-form-item label="是否有工单处理:">
            <el-select v-model="searchForm.isProcessed" placeholder="请选择">
              <el-option label="是" value="是" />
              <el-option label="否" value="否" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              <el-icon><component :is="Search" /></el-icon>
              搜索
            </el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 表格区域 -->
      <div class="table-container">
        <!-- <div v-if="tableData.length === 0 && !loading" class="empty-tip">暂无数据</div> -->
        <el-table v-loading="loading" :data="tableData" height="64vh" stripe style="width: 100%">
          <el-table-column label="手机号" min-width="120" prop="phoneNumber" />
          <el-table-column label="地区" min-width="100" prop="region" />
          <el-table-column label="用户群组" min-width="120" prop="userGroup" />
          <el-table-column label="注册时间" min-width="160" prop="registerTime" />
          <el-table-column label="最近登录时间" min-width="160" prop="lastLoginTime" />
          <el-table-column label="设备数量" min-width="100" prop="deviceNumber" />
          <el-table-column label="安全评分" min-width="100" prop="securityScore" />
          <el-table-column label="排除设备数" min-width="120" prop="removedDevices" />
          <el-table-column label="未读通知数" min-width="120" prop="unprocessedCount" />
          <el-table-column label="待处理工单数" min-width="120" prop="processingOrders" />
          <el-table-column fixed="right" label="操作" min-width="240">
            <template #default="scope">
              <el-button link size="small" type="primary" @click="openDetailDialog(scope.row)">详情</el-button>
              <el-button link size="small" type="success" @click="openNotificationDialog(scope.row)">发送通知</el-button>
              <el-button link size="small" type="primary" @click="openEditUserDialog(scope.row)">修改用户信息</el-button>
              <el-button link size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

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
    <!-- 详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="用户详情" width="600px">
      <el-descriptions border :column="2">
        <el-descriptions-item label="手机号">{{ currentRowDetail.phoneNumber }}</el-descriptions-item>
        <el-descriptions-item label="地区">{{ currentRowDetail.region }}</el-descriptions-item>
        <el-descriptions-item label="用户群组">{{ currentRowDetail.userGroup }}</el-descriptions-item>
        <el-descriptions-item label="注册时间">{{ currentRowDetail.registerTime }}</el-descriptions-item>
        <el-descriptions-item label="最近登录时间">{{ currentRowDetail.lastLoginTime }}</el-descriptions-item>
        <el-descriptions-item label="设备数量">{{ currentRowDetail.deviceNumber }}</el-descriptions-item>
        <el-descriptions-item label="安全评分">{{ currentRowDetail.securityScore }}</el-descriptions-item>
        <el-descriptions-item label="排除设备数">{{ currentRowDetail.removedDevices }}</el-descriptions-item>
        <el-descriptions-item label="未读通知数">{{ currentRowDetail.unprocessedCount }}</el-descriptions-item>
        <el-descriptions-item label="待处理工单数">{{ currentRowDetail.processingOrders }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 发送通知对话框 -->
    <el-dialog v-model="notificationDialogVisible" title="发送通知" width="500px">
      <el-form ref="notificationFormRef" label-width="100px" :model="notificationForm" :rules="notificationRules">
        <el-form-item label="发送给:" style="margin-bottom: 10px">
          <span>{{ currentRowDetail.phoneNumber }}</span>
        </el-form-item>
        <el-form-item label="通知类型:" prop="type">
          <el-select v-model="notificationForm.type" placeholder="请选择通知类型" style="width: 100%">
            <el-option v-for="item in notificationTypes" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="通知标题:" prop="title">
          <el-input v-model="notificationForm.title" placeholder="请输入通知标题" />
        </el-form-item>
        <el-form-item label="通知内容:" prop="content">
          <el-input v-model="notificationForm.content" placeholder="请输入通知内容" :rows="4" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="notificationDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitNotification">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 修改用户信息对话框 -->
    <el-dialog v-model="editUserDialogVisible" title="修改用户信息" width="500px">
      <el-form ref="editUserFormRef" label-width="100px" :model="editUserForm" :rules="editUserRules">
        <el-form-item label="用户名:" prop="username">
          <el-input v-model="editUserForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="用户类型:" prop="userType">
          <el-select v-model="editUserForm.userType" placeholder="请选择用户类型" style="width: 100%">
            <el-option v-for="item in userTypes" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号:" prop="phoneNumber">
          <el-input v-model="editUserForm.phoneNumber" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="省份:" prop="province">
          <el-input v-model="editUserForm.province" placeholder="请输入省份" />
        </el-form-item>
        <el-form-item label="城市:" prop="city">
          <el-input v-model="editUserForm.city" placeholder="请输入城市" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editUserDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitUserEdit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.user-manage-container {
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
