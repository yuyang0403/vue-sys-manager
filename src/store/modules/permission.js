import { asyncRouterMap, constantRouterMap } from '@/router'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param routers 用户拥有的routersCode
 * @param tmp 需要判断是否有权限
 * @param roleList 当前用户的所有角色
 */
function hasPermission(routers, tmp) {
  if (tmp.meta && tmp.meta.code) {
    return routers.some(router => tmp.meta.code === router)
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap 需要判断是否有权限
 * @param routers 用户所有的路由
 */
function filterAsyncRouter(asyncRouterMap, routers) {
  const res = []
  asyncRouterMap.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(routers, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRouter(tmp.children, routers)
      }
      res.push(tmp)
    }
  })

  return res
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const routers = data.routers
        const accessedRouters = filterAsyncRouter(asyncRouterMap, routers)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
