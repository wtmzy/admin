<template>
  <el-scrollbar class="vab-side-bar" :class="{ 'is-collapse': collapse }">
    <vab-logo v-if="layout === 'comprehensive' || layout === 'vertical'" class="fixed-logo" />
    <el-menu
      background-color="var(--el-menu-background-color)"
      :collapse="collapse"
      :collapse-transition="false"
      :default-active="activeMenu.data"
      :default-openeds="defaultOpeneds"
      menu-trigger="click"
      mode="vertical"
      text-color="var(--el-menu-color-text)"
      :unique-opened="uniqueOpened"
    >
      <vab-menu v-for="(item, index) in handleRoutes" :key="index + item.name" :item="item" />
    </el-menu>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import { defaultOpeneds, uniqueOpened } from '/@/config'
import { useRoutesStore } from '/@/store/modules/routes'
import { useSettingsStore } from '/@/store/modules/settings'

defineOptions({
  name: 'VabSideBar',
})

const props = defineProps({
  layout: {
    type: String,
    default: 'vertical',
  },
})

const settingsStore = useSettingsStore()
const { collapse } = storeToRefs(settingsStore)
const routesStore = useRoutesStore()
const { getRoutes: routes, getActiveMenu: activeMenu, getPartialRoutes: partialRoutes } = storeToRefs(routesStore)

const handleRoutes = computed(() =>
  props.layout === 'comprehensive'
    ? partialRoutes.value
    : routes.value.flatMap((route: any) => (route.meta.levelHidden && route.children ? [...route.children] : route))
)
</script>

<style lang="scss" scoped>
@mixin active {
  &:hover {
    color: var(--el-color-white);
    background-color: var(--el-color-primary);
  }

  &.is-active {
    color: var(--el-color-white);
    background-color: var(--el-color-primary);
  }
}

.vab-side-bar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: var(--el-left-menu-width);
  overflow: hidden;
  background: var(--el-menu-background-color);
  transition: var(--el-transition);

  .fixed-logo {
    position: absolute;
    top: 0;
    left: 0;
    z-index: var(--el-z-index);
    width: 100%;
    height: var(--el-header-height);
    background: var(--el-menu-background-color);
  }

  &.is-collapse {
    z-index: calc(var(--el-z-index) + 1);
    width: var(--el-left-menu-width-min);
    border-right: 0;

    :deep() {
      .el-menu {
        border-right: 0 !important;
      }

      .el-menu--collapse.el-menu {
        > .el-menu-item,
        > .el-sub-menu .el-sub-menu__title {
          justify-content: center;
          height: calc(var(--el-menu-item-height) - 6px);
          padding: 0;
          line-height: calc(var(--el-menu-item-height) - 6px);
          text-align: center;

          [class*='ri'] {
            display: block;
            padding: 0 !important;
            margin: 0 !important;
          }

          .el-tag {
            display: none;
          }
        }
      }

      .el-menu-item,
      .el-sub-menu {
        text-align: left;
      }

      .el-menu--collapse {
        border-right: 0;

        .el-sub-menu__icon-arrow {
          right: 10px;
          margin-top: -3px;
        }
      }
    }
  }

  :deep() {
    .el-menu.el-menu--vertical {
      margin-top: var(--el-header-height);
    }

    .el-scrollbar__wrap {
      overflow-x: hidden;
    }

    .el-menu-item,
    .el-sub-menu__title {
      height: var(--el-menu-item-height);
      margin: 0 10px 5px 10px;
      overflow: hidden;
      line-height: var(--el-menu-item-height);
      text-overflow: ellipsis;
      white-space: nowrap;
      border-radius: var(--el-border-radius-base);
      @include active;
    }
  }
}
</style>

<style lang="scss">
.el-menu {
  border-right: 0;
}

.el-menu--popup-right-start {
  --el-menu-hover-bg-color: var(--el-color-primary) !important;
  --el-menu-active-color: var(--el-color-white) !important;

  .is-active {
    background: var(--el-color-primary) !important;
  }
}
</style>
