import { MyRoute } from "@/routes/renderRoutes";
import { ComponentType } from "react";
import { withPermissionRouter } from "../Permission";

/**
 * 所有有name的路由，被认为是可在/f下打开的页面
 * 他们被存放在nameMap
 */
export const nameMap = new Map<string, MenuItem>();

/**
 * 存放有url的
 */
export const urlMap = new Map();

/**
 * 所有有parent这种结构的路由，被认为是菜单
 * 他们被存放在menuTree
 * menuTree被用于菜单渲染
 */
export const menuTree: MenuItem[] = [];

export function eachRoute(route: MyRoute, deep: number) {
  const { path, name, parent, meta, routes } = route;

  path && urlMap.set(path, route);

  routes?.forEach?.((route) => eachRoute(route, deep + 1));

  if (name) {
    const menu: MenuItem = {
      id: name,
      parent: parent,
      url: <string | undefined>path,
      icon: meta?.icon,
      sort: meta?.sort || 99,
      title: meta?.title || "未命名的菜单",
      permission: meta?.permission,
      children: [],
      deep,
    };
    name && nameMap.set(name, menu);
    if (parent === "root") {
      menuTree.push(menu);
    }

    const pNode = nameMap.get(parent as string);

    if (pNode) {
      pNode.children.push(menu);
    }

    if (meta?.permission) {
      route.component = withPermissionRouter({ permission: meta.permission })(
        route.component as ComponentType
      );
    }
  }
}
