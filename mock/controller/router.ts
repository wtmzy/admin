import type { MockMethod } from 'vite-plugin-mock'

const Layout = 'Layout'
const list: VabRouteRecord[] = [
  {
    path: '/',
    name: 'Root',
    component: Layout,
    meta: {
      title: '首页',
      icon: 'home-2-line',
    },
    children: [
      {
        path: 'index',
        name: 'Index',
        component: '/@/views/index/index.vue',
        meta: {
          title: '首页',
          icon: 'home-2-line',
          noClosable: true,
          noKeepAlive: true,
        },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'NotFound',
    meta: {
      title: '404',
      hidden: true,
    },
  },
]

export default [
  {
    url: '/router/getList',
    method: 'get',
    response() {
      return {
        code: 200,
        msg: 'success',
        data: { list },
      }
    },
  },
] as MockMethod[]
