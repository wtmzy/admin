<template>
  <login-container>
    <div class="login-form">
      <img alt="" class="left-img" :src="leftImg" />
      <el-form ref="formRef" label-position="left" :model="form" :rules="rules" @submit.prevent>
        <div class="title">hello !</div>
        <div class="title-tips">欢迎来到{{ title }}</div>
        <el-form-item prop="username">
          <el-input v-model.trim="form.username" v-focus clearable placeholder="请输入用户名" type="text">
            <template #prefix>
              <vab-icon icon="user-line" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input ref="passwordRef" v-model.trim="form.password" clearable placeholder="请输入密码" show-password :type="passwordType">
            <template #prefix>
              <vab-icon icon="lock-line" />
            </template>
          </el-input>
        </el-form-item>
        <!-- 验证码验证逻辑需自行开发，如不需要验证码功能建议注释 -->
        <el-form-item prop="verificationCode">
          <el-input v-model.trim="form.verificationCode" :placeholder="'验证码' + previewText" type="text">
            <template #prefix>
              <vab-icon icon="barcode-box-line" />
            </template>
          </el-input>
          <img class="code" :src="codeUrl" @click="changeCode" />
        </el-form-item>
        <el-button v-throttle="handleLogin" class="login-btn" :loading="loading" type="primary">登录</el-button>
        <router-link to="/register">
          <el-button style="margin-top: 20px; margin-left: -10px" type="primary">注册</el-button>
        </router-link>
        <router-link to="/password">
          <el-button style="margin-top: 20px" text type="primary">忘记密码</el-button>
        </router-link>
      </el-form>
    </div>
  </login-container>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules, InputInstance } from 'element-plus'
import leftImg from '/@/assets/login_images/left_img_1.png'
import { useSettingsStore } from '/@/store/modules/settings'
import { useUserStore } from '/@/store/modules/user'
import { isPassword } from '/@/utils/validate'

defineOptions({
  name: 'Login',
})

interface FormType {
  username: string
  password: string
  verificationCode: string
}

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const settingsStore = useSettingsStore()
const { title } = storeToRefs(settingsStore)
const login = (form: FormType) => userStore.login(form)
const loading = ref<boolean>(false)
const passwordType = ref<string>('password')
const redirect = ref<any>(undefined)
let timer: ReturnType<typeof setInterval>
const codeUrl = ref<string>('https://www.oschina.net/action/user/captcha')
const previewText = ref<string>('')
const formRef = ref<FormInstance>()
const passwordRef = ref<InputInstance>()

const form = reactive<FormType>({
  username: '',
  password: '',
  verificationCode: '',
})

const validateUsername = (rule: any, value: any, callback: any) => {
  if ('' === value) callback(new Error('用户名不能为空'))
  else callback()
}
const validatePassword = (rule: any, value: any, callback: any) => {
  if (isPassword(value)) {
    callback()
  } else {
    callback(new Error('密码不能少于6位'))
  }
}

const rules = reactive<FormRules<FormType>>({
  username: [
    {
      required: true,
      trigger: 'blur',
      validator: validateUsername,
    },
  ],
  password: [
    {
      required: true,
      trigger: 'blur',
      validator: validatePassword,
    },
  ],
})

const handleRoute = () => {
  return redirect.value === '/404' || redirect.value === '/403' ? '/' : redirect.value
}

const handleLogin = async () => {
  if (formRef.value)
    formRef.value?.validate(async (valid: any) => {
      if (valid)
        try {
          loading.value = true
          await login(form).catch(() => {
            loading.value = false
          })
          await router.push(handleRoute())
        } finally {
          loading.value = false
        }
    })
}
const changeCode = () => {
  codeUrl.value = `https://www.oschina.net/action/user/captcha?timestamp=${Date.now()}`
}

watchEffect(() => {
  redirect.value = (route.query && route.query.redirect) || '/'
})

onBeforeRouteLeave((to, from, next) => {
  try {
    if (timer) clearTimeout(timer)
  } catch {
    /* empty */
  }

  next()
})
</script>

<style lang="scss" scoped>
.login-other {
  position: absolute;
  right: 0;
  display: inline-block;
  height: 32px;
  margin-top: var(--el-margin);
  margin-right: 4.5vh;
  line-height: 32px;

  :deep() {
    [class*='ri-'] {
      margin-left: calc(var(--el-margin) / 2);
      font-size: var(--el-font-size-large);
    }
  }
}
</style>
