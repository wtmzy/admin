<script lang="ts" setup>
import { onMounted, ref, onUnmounted } from 'vue'
import { Graph, Shape } from '@/antv/x6'
import '@antv/x6/dist/x6.css'

defineOptions({
  name: 'AntvX6',
})

const container = ref<HTMLElement | null>(null)
const graph = ref<Graph | null>(null)

const initGraph = () => {
  if (!container.value) {
    console.error('Container element not found')
    return
  }

  try {
    // 创建画布
    graph.value = new Graph({
      container: container.value,
      width: container.value.clientWidth,
      height: container.value.clientHeight,
      grid: {
        visible: true,
        type: 'doubleMesh',
        args: [
          {
            color: '#ddd',
            thickness: 1,
          },
          {
            color: '#ddd',
            thickness: 1,
            factor: 4,
          },
        ],
      },
      connecting: {
        snap: true,
        allowBlank: false,
        allowLoop: false,
        highlight: true,
        connector: 'rounded',
        connectionPoint: 'boundary',
      },
      mousewheel: {
        enabled: true,
        zoomAtMousePosition: true,
        modifiers: 'ctrl',
        minScale: 0.5,
        maxScale: 2,
      },
    })

    // 创建基本的电气元件节点
    const rect = new Shape.Rect({
      x: 100,
      y: 100,
      width: 80,
      height: 40,
      label: '开关',
      attrs: {
        body: {
          stroke: '#333',
          strokeWidth: 2,
          fill: '#fff',
        },
      },
      ports: {
        groups: {
          in: {
            position: 'left',
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: '#5F95FF',
                strokeWidth: 1,
                fill: '#fff',
              },
            },
          },
          out: {
            position: 'right',
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: '#5F95FF',
                strokeWidth: 1,
                fill: '#fff',
              },
            },
          },
        },
        items: [
          { group: 'in' },
          { group: 'out' },
        ],
      },
    })

    graph.value.addNode(rect)
    console.log('Graph initialized successfully')
  } catch (error) {
    console.error('Failed to initialize graph:', error)
  }
}

// 监听窗口大小变化
const handleResize = () => {
  if (container.value && graph.value) {
    const { clientWidth, clientHeight } = container.value
    graph.value.resize(clientWidth, clientHeight)
  }
}

onMounted(() => {
  initGraph()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (graph.value) {
    graph.value.dispose()
  }
})
</script>

<template>
  <div class="index-container">
    <div ref="container" class="x6-container"></div>
  </div>
</template>

<style lang="scss" scoped>
.index-container {
  box-sizing: border-box;
  width: 100%;
  height: 100vh;
  padding: 16px;
  background-color: #f5f5f5;

  .x6-container {
    width: 100%;
    height: 100%;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
}
</style>
