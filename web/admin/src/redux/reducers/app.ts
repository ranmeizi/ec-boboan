import { AnyAction } from "redux";
import * as TYPES from "../ACTION_TYPES";

type UInfo = {
  email: string;
  token: string;
  username: string;
  bio: string;
  image: string;
};

type AppState = {
  theme: "light" | "dark";
  uinfo: Partial<UInfo>;
  collapsed: boolean;
  permission: string[],
  message: Record<string, number>
};

const initialState: AppState = {
  /* 主题 */
  theme: "dark",
  /* 用户信息 */
  uinfo: {},
  /* 边栏隐藏 */
  collapsed: false,
  /* 权限列表 */
  permission: [],
  /* 消息数量 */
  message: {
    HOMEPAGE: 9
  }
};

export default function reducer(
  state: AppState = initialState,
  action: AnyAction
): AppState {
  switch (action.type) {
    case TYPES.SET_THEME:
      return {
        ...state,
        theme: action.data,
      };
    case TYPES.SET_UINFO:
      return {
        ...state,
        uinfo: action.data,
      };
    case TYPES.CLEAR_UINFO:
      return {
        ...state,
        uinfo: {},
      };
    case TYPES.SET_PERMISSION:
      return {
        ...state,
        permission: action.data,
      };
    case TYPES.SET_COLLAPSED:
      return {
        ...state,
        collapsed: action.data,
      };
    case TYPES.SET_MESSAGE:
      return {
        ...state,
        message: action.data
      }
    default:
      return state;
  }
}
