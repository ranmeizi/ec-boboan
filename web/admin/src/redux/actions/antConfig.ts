import * as ACTION_TYPES from "../ACTION_TYPES";
import { ConfigType } from "../reducers/antConfig";

export function setAntConfig(config: ConfigType) {
    return {
        type: ACTION_TYPES.SET_ANT_CONFIG,
        data: config
    }
}