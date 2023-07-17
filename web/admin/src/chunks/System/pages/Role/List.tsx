import React, { useMemo, useRef } from 'react'
import Page from '@/components/Page'
import { Tree } from 'antd'
import { MyRoute } from "@/routes/renderRoutes";
import { setPermission } from '@/redux/actions/app';
import { useSelector, useDispatch } from 'react-redux'
import routes from '@/routes';
import { Link } from 'react-router-dom'

const permissionSelector = (state: any) => state.app.permission

export default function () {
    const permissionList: string[] = useSelector(permissionSelector)
    const map = useRef<Record<string, any>>({})
    const dispatch = useDispatch()

    const treeData = useMemo(() => {
        const treeData: any[] = []
        function eachNode(route: MyRoute) {
            const { name, parent, meta, routes } = route;
            if (name) {
                const treeNode = {
                    key: name,
                    title: meta?.title,
                    permission: meta?.permission,
                    children: []
                }

                map.current[name] = treeNode
                if (parent === 'root') {
                    treeData.push(treeNode)
                }

                if (parent && map.current[parent]) {
                    map.current[parent].children.push(treeNode)
                }

            }

            if (routes) {
                routes.forEach(eachNode)
            }
        }
        // 使用route 创建 treeData
        routes.forEach(eachNode)
        return treeData
    }, [])

    const checkedKeys = useMemo(() => {
        return Object.values(map.current).filter(item => {
            if (!item.permission) {
                return true
            } else {
                return permissionList.includes(item.permission)
            }
        }).map(item => item.key)
    }, [permissionList])

    function onCheck(checkedKeys: any, { checkedNodes }: any) {
        dispatch(setPermission(checkedNodes.reduce((list: any, curr: any) => {
            if (curr.permission) {
                list.push(curr.permission)
            }
            return list
        }, [])))
    }
    return <Page>
        <div>我是权限模块 <input type="text" /></div>
        <div>
            测试修改权限(这只是前端假数据，这块的权限应该存在后台，前端只定义了页面的结构)
            <Tree
                checkable
                checkedKeys={checkedKeys}
                treeData={treeData}
                onCheck={onCheck}
            />
        </div>
        <div>
            <button onClick={() => location.reload()}>刷新</button>
            <div><Link to={'/f/homepage'}>工作台</Link></div>
            <div><Link to={'/f/example/list'}>示例列表页</Link></div>
        </div>
    </Page>
}