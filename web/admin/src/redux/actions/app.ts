import * as ACTION_TYPES from "../ACTION_TYPES";
import { themeChange } from "@/theme/useThemeStyle";

// 设置皮肤
export function setTheme(theme: "light" | "dark") {
  document.body.className = "rvt-body-" + theme;
  themeChange(theme);
  return {
    type: ACTION_TYPES.SET_THEME,
    data: theme,
  };
}

// 存放user信息
export function setUinfo(uinfo: any) {
  return {
    type: ACTION_TYPES.SET_UINFO,
    data: uinfo,
  };
}

// 清空user信息 退出登陆
export function clearUinfo() {
  return {
    type: ACTION_TYPES.CLEAR_UINFO,
  };
}

// 设置权限列表
export function setPermission(permissionList: string[]) {
  return {
    type: ACTION_TYPES.SET_PERMISSION,
    data: permissionList,
  };
}

// 设置边栏显示隐藏
export function setCollapsed(collapsed: boolean) {
  return {
    type: ACTION_TYPES.SET_COLLAPSED,
    data: collapsed,
  };
}

// 设置全局消息
export function setMessage(message: Record<string, number>) {
  console.log(message)
  return {
    type: ACTION_TYPES.SET_MESSAGE,
    data: message,
  };
} 