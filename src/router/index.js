import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */
// icon example table dashboard
/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    name: 'default',
    path: '/',
    // 默认打开登录页
    redirect: { path: '/login' }
  },
  
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/index',
    component: Layout,
    redirect: { name: 'dashboard' },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/index')
        // meta: { title: '', icon: '' }
      }
    ]
  },

  {
    path: '',
    component: Layout,
    // redirect: 'annual',
    meta: { title: '订单管理', icon: 'example' },
    children: [
      {
        path: 'annual',
        name: 'annual',
        component: () => import('@/views/annual/index'),
        meta: { title: '年检订单', icon: 'dashboard' ,}
      },
      {
        path: 'serve',
        name: 'serve',
        component: () => import('@/views/serve/index'),
        meta: { title: '服务订单', icon: 'dashboard' ,}
      }
    ]
  },

  {
    path: '/nodeList',
    alwaysShow: true,
    component: Layout,
    meta: { title: '网点管理', icon: 'example' },
    children: [
      {
        path: 'nodeList',
        name: 'nodeList',
        component: () => import('@/views/nodeList/index'),
        meta: { title: '网点列表', icon: 'table' }
      }
    ]
  },

  {
    path: '/account',
    component: Layout,
    meta: { title: '账号管理', icon: 'example' },
    children: [
      // {
      //   path: 'nodeList',
      //   name: 'nodeList',
      //   component: () => import('@/views/nodeList/index'),
      //   meta: { title: '技师账号管理', icon: 'table' }
      // },
      {
        path: 'account',
        name: 'account',
        component: () => import('@/views/account/index'),
        meta: { title: '网点账号管理', icon: 'table' }
      },
      {
        path: 'carOwner',
        name: 'carOwner',
        component: () => import('@/views/carOwner/index'),
        meta: { title: '车主账号管理', icon: 'table' }
      }
    ]
  },

  {
    path: '/charge',
    component: Layout,
    meta: { title: '费用设置', icon: 'example' },
    children: [
      {
        path: 'charge',
        name: 'charge',
        component: () => import('@/views/charge/index'),
        meta: { title: '网点费用列表', icon: 'table' }
      },
      {
        path: 'chargeList',
        name: 'chargeList',
        component: () => import('@/views/chargeList/index'),
        meta: { title: '市场费用列表', icon: 'table' }
      }
    ]
  },

  {
    path: '/audit',
    alwaysShow: true,
    component: Layout,
    meta: { title: '核销管理', icon: 'example' },
    children: [
      {
        path: 'audit',
        name: 'audit',
        component: () => import('@/views/audit/index'),
        meta: { title: ' 核销统计', icon: 'table' }
      }
    ]
  },

  // {
  //   path: '/form',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Form',
  //       component: () => import('@/views/form/index'),
  //       meta: { title: 'Form', icon: 'form' }
  //     }
  //   ]
  // },

  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: 'Nested',
  //     icon: 'nested'
  //   },
  //   children: [
  //     {
  //       path: 'menu1',
  //       component: () => import('@/views/nested/menu1/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: { title: 'Menu1' },
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           component: () => import('@/views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: { title: 'Menu1-1' }
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () => import('@/views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: { title: 'Menu1-2' },
  //           children: [
  //             {
  //               path: 'menu1-2-1',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: { title: 'Menu1-2-1' }
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: { title: 'Menu1-2-2' }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () => import('@/views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: { title: 'Menu1-3' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('@/views/nested/menu2/index'),
  //       meta: { title: 'menu2' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
