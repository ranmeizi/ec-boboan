import { AnyAction } from "redux";
import * as TYPES from "../ACTION_TYPES";
import { ConfigProviderProps } from 'antd/lib/config-provider';

export type ConfigType = Partial<ConfigProviderProps>

export default function reducer(
    state: ConfigType = {},
    action: AnyAction
): ConfigType {
    switch (action.type) {
        case TYPES.SET_ANT_CONFIG:
            return {
                ...state,
                ...action.data
            };
        default:
            return state;
    }
}
