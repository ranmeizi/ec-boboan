import env, { EnvConfig } from "./env";

type Config = {
  TAB_LIMIT: string | number;
  HOME_PAGE: string
};

const config: Config = {
  TAB_LIMIT: 10,
  HOME_PAGE: '/f/homepage'
};

Object.assign(config, env);

if (window?.rvtConfig) {
  Object.assign(config, window.rvtConfig);
}

export default config as Config & EnvConfig["DEVELOP"]
