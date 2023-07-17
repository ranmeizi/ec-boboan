import React, { useEffect, useState, useMemo } from 'react'
import Page from '@/components/Page'
import { Card, Typography, Form, Button, Space, Table, Dropdown, Menu, Divider, Modal, Pagination, TableColumnType, Image } from 'antd'
import MyForm from './MyForm'
import { usePagination, useRowSelection } from '@/utils/hooks/common'
import { ExpandOutlined, DownOutlined, SettingOutlined } from '@ant-design/icons'
import * as API from '@/services/pokemon'

/**
 * ant-design风格示例，探索中，并不一定是最佳实践
 */
export default function () {
    // 表单
    const [form] = Form.useForm();
    const [expand, setExpand] = useState(false)
    const [full, setFull] = useState(false)
    // 表格数据
    const [list, setList] = useState<API.dto.PokemonListDto[]>([])
    // 分页器
    const [pagination, setPagination, paginationProps] = usePagination()
    // 选择器
    const { selectionProps, showDetail, reset } = useRowSelection()

    useEffect(() => {
        getData(1)
    }, [])

    async function getData(pageNum = pagination.pageNum, pageSize = pagination.pageSize) {
        // 获取查询条件
        const params = form.getFieldsValue()
        const {
            list,
            ...page
        } = await API.getPokemonList({
            ...params,
            pageNum,
            pageSize
        })
        setList(list)
        reset()
        setPagination({
            pageNum: page.pageNumber,
            pageSize: page.pageSize,
            total: page.total
        })
    }

    const columns: any[] = useMemo(() => {
        return getColumns({})
    }, [])

    return <Page>
        {/* 标题 */}
        <Typography.Title level={5}>查询表格</Typography.Title>
        {/* 数据过滤 */}
        <Card style={{ marginBottom: '16px' }}>
            {/* 复杂查询框可以拆分文件 */}
            <MyForm form={form} expand={expand} />
            <div className='f-r j-end mt-16'>
                <Space>
                    <Button onClick={() => form.resetFields()}>重置</Button>
                    <Button type="primary" onClick={async () => {
                        getData()
                    }}>查询</Button>
                    <Button type='link' onClick={() => setExpand(!expand)}>{expand ? '简单搜索' : '高级搜索'}</Button>
                </Space>
            </div>
        </Card>
        <div className={full ? 'full-page' : ''}>
            {/* 数据列表 */}
            <Card>
                <div className='f-r j-between'>
                    <Typography.Title level={5}>数据列表</Typography.Title>
                    {/* 按钮组 */}
                    <div>
                        <Space>
                            <Button>批量导入</Button>
                            <Dropdown overlay={<Menu>
                                <Menu.Item key="1" >
                                    导出到excel
                                </Menu.Item>
                                <Menu.Item key="2" >
                                    导出到csv
                                </Menu.Item>
                                <Menu.Item key="3">
                                    导出到xml
                                </Menu.Item>
                            </Menu>}>
                                <Button>
                                    导出数据 <DownOutlined />
                                </Button>
                            </Dropdown>
                            <Button type='primary'>新建图鉴</Button>
                        </Space>
                        <Divider type="vertical" />
                        <Space>
                            <Button type='link' onClick={() => Modal.info({
                                title: '表格配置',
                                content: '可以做一些表格项的配置'
                            })}> <SettingOutlined /></Button>
                            <Button type='link' onClick={() => setFull(!full)}><ExpandOutlined /></Button>
                        </Space>
                    </div>
                </div>
            </Card>
            {/* table */}
            <Table
                rowKey='id'
                scroll={{ x: 1300 }}
                columns={columns}
                dataSource={list}
                pagination={false}
                rowSelection={selectionProps}
            />
            <div style={{ height: '57px' }}></div>
        </div>

        {/* 批量操作 */}
        <Card className='rvt-page-bottom'>
            <div className='f-r j-between' style={{ width: '100%' }}>
                {showDetail}
                <Space>
                    <Button danger>批量删除</Button>
                    <Button>批量导出</Button>
                    <Button type='primary'>批量查看</Button>
                    <Pagination {...paginationProps} />
                </Space>
            </div>
        </Card>
    </Page>
}

function getColumns(ctx: any): TableColumnType<any>[] {
    console.log(ctx)
    return [
        {
            title: '宝可梦',
            width: 240,
            fixed: 'left',
            dataIndex: 'id+name+pic',
            render(text, record: any) {
                return <div className='f-r a-center'>
                    <Image width={48} src={record.pic} />
                    &nbsp;
                    <span>{record.id}</span>
                    &nbsp;
                    <span>{record.name}</span>
                </div>
            }
        },
        { title: '叫声', width: 120, dataIndex: 'cry' },
        { title: '属性', width: 120, dataIndex: 'nature' },
        { title: '分类', width: 120, dataIndex: 'type' },
        { title: '描述', width: 200, ellipsis: true, dataIndex: 'desc' },
        { title: '身高', width: 120, dataIndex: 'height' },
        { title: '体重', width: 120, dataIndex: 'weight' },
        { title: '蛋群', width: 160, dataIndex: 'egg' },
        { title: '获得努力值', width: 160, dataIndex: 'receiveEffort' },
        { title: '特性', width: 120, dataIndex: 'character' },
        {
            title: '操作',
            width: 180,
            fixed: 'right',
            render() {
                return <Space>
                    <a>查看</a>
                    <a>编辑</a>
                    <a>删除</a>
                </Space>
            }
        },
    ]
}
