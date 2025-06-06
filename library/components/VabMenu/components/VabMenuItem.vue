<template>
  <el-menu-item :index="itemOrMenu.path" @click="handleLink">
    <vab-icon
      v-if="itemOrMenu.meta && itemOrMenu.meta.icon"
      :icon="itemOrMenu.meta.icon"
      :is-custom-svg="itemOrMenu.meta.isCustomSvg"
      :title="itemOrMenu.meta.title"
    />
    <span :title="itemOrMenu.meta.title">
      {{ itemOrMenu.meta.title }}
    </span>
    <el-tag v-if="itemOrMenu.meta && itemOrMenu.meta.badge" effect="dark" :type="itemOrMenu.meta.badgeType || 'danger'">
      {{ itemOrMenu.meta.badge }}
    </el-tag>
    <vab-dot
      v-if="itemOrMenu.meta && itemOrMenu.meta.dot"
      :type="typeof itemOrMenu.meta.dot === 'string' ? itemOrMenu.meta.dot : 'danger'"
    />
  </el-menu-item>
</template>

<script lang="ts" setup>
import { isHashRouterMode } from '/@/config'
import { useSettingsStore } from '/@/store/modules/settings'
import { isExternal } from '/@/utils/validate'

defineOptions({
  name: 'VabMenuItem',
})

const props = defineProps({
  itemOrMenu: {
    type: Object,
    default: () => {},
  },
})

const route = useRoute()
const router = useRouter()

const settingsStore = useSettingsStore()
const { device } = storeToRefs(settingsStore)
const { foldSideBar } = settingsStore
const { enter, exit } = useFullscreen()

const handleLink = () => {
  nextTick(() => {
    const routePath = props.itemOrMenu.path
    const target = props.itemOrMenu.meta.target
    const fullscreen = props.itemOrMenu.meta.fullscreen

    if (target === '_blank') {
      if (isExternal(routePath)) {
        window.open(routePath)
        router.push('/redirect')
      } else if (route.path !== routePath) isHashRouterMode ? window.open(`#${routePath}`) : window.open(routePath)
      router.push('/redirect')
    } else {
      if (isExternal(routePath)) window.location.href = routePath
      else if (route.path !== routePath) {
        if (device.value === 'mobile') foldSideBar()
        router.push(props.itemOrMenu.path)
      }
    }

    setTimeout(() => {
      if (fullscreen) enter()
      else exit()
    }, 1000)
  })
}
</script>

<style lang="scss" scoped>
:deep(.el-tag) {
  position: absolute;
  right: 20px;
  height: 18px;
  padding-right: 5px;
  padding-left: 5px;
  font-size: var(--el-font-size-extra-small);
  line-height: 18px;
}

.vab-dot {
  position: absolute !important;
  right: 20px;
}
</style>
