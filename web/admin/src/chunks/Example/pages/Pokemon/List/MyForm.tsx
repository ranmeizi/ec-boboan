import React from 'react'
import { Form, FormInstance, Input, Col, Select } from 'antd'
import EggSelect from '../components/FormComp/EggSelect'

type MyFormProps = {
    form: FormInstance,
    expand: boolean // 高级搜索？
}

export default function ({ form, expand }: MyFormProps) {
    console.log(expand)
    return <Form
        layout='inline'
        form={form}
    >
        <Col xxl={4} xl={6}>
            <Form.Item name="name" label="名称">
                <Input placeholder="模糊搜索" />
            </Form.Item>
        </Col>
        <Col xxl={4} xl={6}>
            <Form.Item name="nature" label="属性">
                <Input />
            </Form.Item>
        </Col>
        <Col xxl={4} xl={6}>
            {/* 简单标单项 */}
            <Form.Item name="color" label="颜色">
                <Select>
                    <Select.Option >白色</Select.Option>
                    <Select.Option>红色</Select.Option>
                    <Select.Option>蓝色</Select.Option>
                </Select>
            </Form.Item>
        </Col>
        <Col xxl={4} xl={6}>
            {/* 复杂标单项或可复用，考虑拆分成组件 */}
            <Form.Item name="egg" label="蛋群">
                <EggSelect />
            </Form.Item>
        </Col>
    </Form>
}
