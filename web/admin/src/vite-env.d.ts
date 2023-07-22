/// <reference types="vite/client" />

interface Window {
  devToolsExtension: any;
  CONSTANTS: any;
  rvtConfig: any;
  __REDUX_DEVTOOLS_EXTENSION__: any;
}

// 定义全局的类型和一些常用范型

type JssSheet<T extends string> = {
  [k in T]: React.CSSProperties;
};

interface Theme {
  bg: {
    pri?: string;
    sec?: string;
  };
  fc: {
    header?: string;
    text?: string;
    desc?: string;
    active?: string;
  };
  transition: string;
}

// 菜单项
interface MenuItem {
  /* key */
  id: string;
  /* parent name */
  parent: string | undefined;
  /* menu跳转的url */
  url?: string;
  /* menu的icon */
  icon?: string;
  /* menu的名称 */
  title: string;
  /* 排序 */
  sort: number;
  /* 权限 */
  permission?: string;
  /* 拥有children的item将会成为submenu */
  children: MenuItem[];
  /* 深度 可能会去控制缩进 */
  deep: number;
}

// 导航tab
type TabPane = {
  id: string;
  name: string;
  title: string;
  icon: string;
};
