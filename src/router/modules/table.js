/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const tableRouter = {
  path: '/system_manager',
  component: Layout,
  redirect: '/table/complex-table',
  name: 'system_manager',
  meta: {
    code: 'system_manager',
    title: 'system_manager',
    icon: 'table'
  },
  children: [
    {
      path: 'user-manager',
      component: () => import('@/views/table/complexTable'),
      name: 'user-manager',
      meta: { code: 'user_manager', title: 'user_manager', icon: 'user' }
    },
    {
      path: 'role-manager',
      component: () => import('@/views/table/complexTable'),
      name: 'role-manager',
      meta: { code: 'role_manager', title: 'role_manager', icon: 'peoples' }
    },
    {
      path: 'router-manager',
      component: () => import('@/views/table/complexTable'),
      name: 'router-manager',
      meta: { code: 'router_manager', title: 'router_manager', icon: 'people' }
    }
  ]
}
export default tableRouter
