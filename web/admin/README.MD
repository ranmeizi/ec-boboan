# react-vite-template
vite 搭建的 react 开发平台  

建议使用 typescript 语言开发，这样开发过程中会有类型提示，别的小伙伴读代码也会方便很多

因为用的是vite，dev模式使用的是modulejs可能有些浏览器不适配，不过build时添加了legacy适配ie11浏览器，不过这个项目的代码css没有适配ie11

## 开始

使用 
```npm install``` 

或者 

```yarn install``` 

安装依赖  

## 技术栈
React、Typescript、less、vite、jest、ant-design

## 目录结构
\- build   viteconfig 文件  
\- deploy   部署脚本  
\- public   public文件夹  
\-- images   图片资源  
\-- mock    假数据json  
\- src  
\-- @types   类型  
\-- assets   资源  
\-- chunks   异步模块  
\-- components    公共组件  
\-- config   配置  
\-- layouts   布局框架  
\-- redux  
\-- routes   路由配置  
\-- services   后台服务相关  
\-- utils   工具函数  
\-- views   页面(同步模块) 如果想拆分异步模块，请写到 chunks 里  
\- test   单元测试文件

## 框架
框架开发最多的是路由模块
rvt 提供了拥有 **缓存(keepalive)** / **过度动画(transition)** / **权限(permission)** / **异常边界(Errorboundery)** / **异步(lazy)** 的路由

换肤
提供了 css 变量换肤 和 cssinjs 的 style 行内样式换肤的例子

## 路由模块
实现的非常耦合，好在都是基础不太用改，简单介绍一下
### RouterView
用到了这几个三方模块  

使用 [react-router-dom](https://github.com/remix-run/react-router) 做 路由  
使用 [react-activation](https://github.com/CJY0208/react-activation) 做 KeepAlive  
使用 [react-transition-group](https://github.com/reactjs/react-transition-group) 做 Transition  

组件结构
```js
// Transition 过度动画
<TransitionGroup>
    <CSSTransition>
        {/* KeepAlive 路由缓存 */}
        <KeepAlive>
            {/* Suspense/lazy 异步路由模块 */}
            <Suspense>
                {/* ErrorBoundery 错误边界 */}
                <ErrorBoundery>
                    {/* Route 路由组件 */}
                    <Route/>
                        {/*
                            props=><Page>
                                .....页面开发
                            </Page>
                        */}
                </ErrorBoundery>
            </Suspense>
        </KeepAlive>
    </CSSTransition>
<TransitionGroup/>
```

规定 RouterView 组件，都使用 [Page](./src/components/Page/index.tsx) 组件作为根节点，这是因为 Page 组件需要在每次 route match 时，触发 Tab 组件的 ```PAGE_PUSH_TAB``` 事件

统一使用 Page 组件也可以很好的将 系统维护 和 迭代开发 拆分开

#### RouterConfig 
拓展了 Route 组件的 props ，详见 [MyRoute](./src/routes/renderRoutes.tsx)
```ts
interface CustRouteParam {
    name?: string, // 唯一id
    parent?: string, // 父id
    meta?: Partial<Meta>, // meta 信息
    isTransition?: boolean, // 是否需要过渡动画
    isCache?: boolean, // 是否需要缓存
    routes?: MyRoute[], // 普通路由
}
```

### Tab 组件 和 LRU  
[LRU(Least Recently Used)](./src/components/Header/LRU.ts)  
lru.current type:MyRoute 最近一次访问的 route
项目使用 lru 控制了  
1. Tab 页的数量  
2. KeepAlive 组件的缓存销毁  

使用 KeepAlive id 当作 lru 的 key
lru.del 会清除掉对应 KeepAlive 缓存  
Tab 组件的 api 操作 TapPane 数组时，所有删除操作都会调用 del，清除 lru 缓存

### ErrorBoundery

TODO  
并没有记录 Error 信息，将捕获的异常准备放进 indexeddb，并提供一个查询上传页面