import AsyncModule from '../AsyncModule'

// 模块不要切分的太小，可以合并的！不用拿业务区分模块
export default class Module extends AsyncModule {

    // 模块单例
    static _instance: any = null

    get(name: string = 'default') {
        if (!Module._instance) {
            Module._instance = import('./Example')
        }
        return AsyncModule.getModule(Module._instance, name)
    }
}
