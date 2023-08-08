import { describe, expect, test } from '@jest/globals';
import fs from 'fs';
import {packData,unpackData} from './index'

describe('packet',()=>{
    test('encode/decode1',()=>{
        const arrayBuffer = fs.readFileSync('a.json')
        const data = packData({event:0,source:'w6nZJaxUC_nOjx87AAAA',destination:'w6nZJaxUC_nOjx87AAAA'},arrayBuffer)
        console.log(data)
        const {header,data:_data} = unpackData(data)
        
        console.log(header,_data)
    })
})