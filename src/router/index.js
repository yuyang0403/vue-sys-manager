import Vue from 'vue'
import Router from 'vue-router'
import { findRouterFromServer } from '@/api/router.js'

Vue.use(Router)

/* Router Modules
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'
*/
/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/

export const constantRouterMap = [
  {
    path: '/redirect',
    component: () => import('@/views/layout/Layout'),
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: () => import('@/views/layout/Layout'),
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
      }
    ]
  },
  {
    path: '/guide',
    component: () => import('@/views/layout/Layout'),
    redirect: '/guide/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/guide/index'),
        name: 'Guide',
        meta: { title: 'guide', icon: 'guide', noCache: true }
      }
    ]
  },
  {
    path: '/error',
    component: () => import('@/views/layout/Layout'),
    redirect: 'noredirect',
    name: 'ErrorPages',
    meta: {
      title: 'errorPages',
      icon: '404'
    },
    children: [
      {
        path: '401',
        component: () => import('@/views/errorPage/401'),
        name: 'Page401',
        meta: { title: 'page401', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/errorPage/404'),
        name: 'Page404',
        meta: { title: 'page404', noCache: true }
      }
    ]
  },

  {
    path: '/error-log',
    component: () => import('@/views/layout/Layout'),
    redirect: 'noredirect',
    children: [
      {
        path: 'log',
        component: () => import('@/views/errorLog/index'),
        name: 'ErrorLog',
        meta: { title: 'errorLog', icon: 'bug' }
      }
    ]
  },
  { path: '*', redirect: '/404', hiddsen: true }
]

export default new Router({
  // mode: 'history', // require service supports
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
export const asyncRouterMap = []

findRouterFromServer().then(response => {
  const data = response.data
  data.forEach(element => {
    asyncRouterMap.push({
      path: element.path,
      component: () => import(element.component),
      meta: { title: element.title, icon: element.icon },
      name: element.name,
      children: getChildren(element.children)
    })
  })
})

// 递归拼接router
function getChildren(children) {
  const chilArray = []
  if (children && children.length > 0) {
    children.forEach(element => {
      chilArray.push({
        path: element.path,
        component: () => import(element.component),
        name: element.name,
        meta: { title: element.title, icon: element.icon }
      })
      getChildren(element.children)
    })
  }
  return chilArray
}

