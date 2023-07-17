import React, { useState, useEffect } from 'react'
import { Select } from 'antd'
import * as MockAPI from '@/services/pokemon'

export default function ({
    value,
    onChange
}: any) {
    const [list, setList] = useState<MockAPI.dto.PokemonEggDto>([])
    useEffect(() => {
        async function getData() {
            setList(await MockAPI.getPokemonEgg())
        }
        getData()
    }, [])

    return <Select value={value} onChange={onChange}>
        {list.map(item => <Select.Option key={item}>{item}</Select.Option>)}
    </Select>
}   