import React, { useState, useRef, useEffect, useMemo } from "react"
import { PaginationProps, Space } from "antd"
import { TableRowSelection } from "antd/lib/table/interface"

export function useRefState<T>(initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>, React.MutableRefObject<T>] {
    const [v, setV] = useState(initialValue)
    const vRef = useRef(initialValue)
    useEffect(() => {
        vRef.current = v
    }, [v])
    return [v, setV, vRef]
}

type PaginationOptions = {
    defaultPageSize?: number
    defaultPageNum?: number
    props?: Partial<PaginationProps>
}

type PaginationType = {
    pageSize: number,
    pageNum: number,
    total: number
}

// 分页器 什么都不传就是 统一分页器
export function usePagination({
    defaultPageSize = 20,
    defaultPageNum = 1,
    props = {}
}: PaginationOptions = {}): [PaginationType, React.Dispatch<React.SetStateAction<PaginationType>>, Partial<PaginationProps>] {

    const [pagination, setPagination] = useState<PaginationType>({
        pageNum: defaultPageNum,
        pageSize: defaultPageSize,
        total: 0
    })

    const paginationProps: Partial<PaginationProps> = useMemo(() => ({
        current: pagination.pageNum,
        total: pagination.total,
        size: 'small',
        showTotal: (showtotal: number, range: [number, number]): string => {
            const current = Math.ceil(range[1] / pagination.pageSize)
            const all = Math.ceil(showtotal / pagination.pageSize)
            return `共${showtotal}条记录 第${current}/${all}页`
        },
        ...props
    }), [pagination, props])

    return [pagination, setPagination, paginationProps]
}

// 选择器
export function useRowSelection<T = any>(props: TableRowSelection<T> = {}) {
    const [selectedRowKeys, setSelectRowKeys] = useState<React.Key[]>([])
    const selectedRow = useRef<T[]>([])

    // 统一属性
    const selectionProps = {
        selectedRowKeys,
        onChange(selectedRowKeys: React.Key[], selectedRows: T[]) {
            setSelectRowKeys(selectedRowKeys)
            selectedRow.current = selectedRows
        },
        ...props
    }
    function reset() {
        setSelectRowKeys([])
        selectedRow.current = []
    }

    // 页面上显示内部数据的元素
    const showDetail = useMemo(() => {
        return <Space>
            <span>已选<span>{selectedRowKeys.length}项</span></span>
            <a onClick={reset}>取消</a>
        </Space>
    }, [selectedRowKeys])

    return {
        selectedRowKeys,
        reset,
        showDetail,
        selectedRow: selectedRow.current,
        selectionProps
    }
}