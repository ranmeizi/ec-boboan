import React, { useEffect } from 'react'
import { createForm, PropsWithForm, FormValidateRule } from 'rc-form'

// 表单组件属性
type FormProps = {
    apiRef?: React.MutableRefObject<any>
}

// 校验规则
const rules: Record<string, FormValidateRule[]> = {}

function Form({
    apiRef,
    form
}: PropsWithForm<FormProps, { form: any }>) {
    const { getFieldProps } = form
    useEffect(() => {
        if (apiRef) {
            apiRef.current = form
        }
    }, [])
    return <div>
        rvt-form
    </div>
}

export default createForm<FormProps>()(Form as any)
