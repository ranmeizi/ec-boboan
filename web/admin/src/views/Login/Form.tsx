import React from 'react'
import { Form, FormInstance, Input, Button, Checkbox } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons';

type MyFormProps = {
    form: FormInstance,
    onSubmit?: (data: any) => void,
    expand?: boolean // 高级搜索？
}

export default function ({
    form,
    onSubmit
}: MyFormProps) {
    return <Form
        size='large'
        onFinish={onSubmit}
        form={form}
    >
        <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
        >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
        </Form.Item>
        <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
        >
            <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="密码"
            />
        </Form.Item>
        <Form.Item >
            <div className='f-r j-between'>
                <Checkbox>记住密码</Checkbox>
                <a className="login-form-forgot" href="">
                    忘记密码
                </a>
            </div>
        </Form.Item>

        <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button w-100">
                登陆
            </Button>
        </Form.Item>
    </Form>
}
