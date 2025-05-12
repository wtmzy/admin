<template>
  <el-config-provider :button="{ autoInsertSpace: true }" :locale="zhLocale">
    <router-view />
  </el-config-provider>
</template>

<script lang="ts" setup>
import zhLocale from 'element-plus/es/locale/lang/zh-cn'

defineOptions({
  name: 'VabApp',
})
</script>
