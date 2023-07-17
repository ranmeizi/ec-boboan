import React from 'react'
import { Radio, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import * as actions from '@/redux/actions/antConfig'
import * as appActions from '@/redux/actions/app'

const configSelector = (state: any) => state.antConfig
const messageSelector = (state: any) => state.app.message

export default function () {
    const config = useSelector(configSelector)
    const message = useSelector(messageSelector)
    const dispatch = useDispatch()
    return <div>
        <Radio.Group
            value={config.componentSize}
            onChange={e => {
                dispatch(actions.setAntConfig({
                    componentSize: e.target.value
                }))
            }}
        >
            <Radio.Button value="small">Small</Radio.Button>
            <Radio.Button value="middle">Middle</Radio.Button>
            <Radio.Button value="large">Large</Radio.Button>
        </Radio.Group>
        {/* 设置一下Badge吧 */}
        {
            Object.entries(message).map(([k, v]) => {
                return <BadgeEditor key={k} name={k} value={v} onChange={(value: number) => {
                    dispatch(appActions.setMessage({
                        ...message,
                        [k]: value
                    }))
                }} />
            })
        }
    </div>
}

function BadgeEditor({
    name,
    value,
    onChange
}: any) {

    return <div>
        <div>{name}:</div>
        <div>{value}</div>
        <Button onClick={() => onChange(value + 1)}>++</Button>
        <Button onClick={() => onChange(value - 1)}>--</Button>
    </div>
}