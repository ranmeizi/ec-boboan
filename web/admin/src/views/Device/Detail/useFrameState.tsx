import { useState, useContext, useEffect } from "react";
import { context } from '@/contexts/ECws/context'
import { wsEventBus } from "@/utils/EventBus";

enum EnumControlState {
    none = 0,
    startConfer = 1,
    transferring = 2,
    stopConfer = 3
}


// 状态只因
export default function useFrameState(id: string) {
    const [state, setState] = useState(0)

    const { sendText } = useContext(context)

    function startFrame() {
        sendText('reqFrame', { id: id })
        setState(EnumControlState.startConfer)
    }

    function stopFrame() {
        sendText('reqFrameStop', { id: id })
        setState(EnumControlState.stopConfer)
    }

    useEffect(() => {
        function handleReqFrameRes(data: Res.EC.data<boolean>) {
            if (data.code === 200) {
                setState(EnumControlState.transferring)
            }
        }

        function handleReqFrameStopRes(data: Res.EC.data<boolean>) {
            if (data.code === 200) {
                setState(EnumControlState.none)
            }
        }

        if (state === EnumControlState.startConfer) {
            wsEventBus.on('reqFrameRes', handleReqFrameRes)
        }

        if (state === EnumControlState.stopConfer) {
            wsEventBus.on('reqFrameStopRes', handleReqFrameStopRes)
        }

        return () => {
            wsEventBus.un('reqFrameStopRes', handleReqFrameStopRes)
        }
    }, [state])

    return {
        state,
        startFrame,
        stopFrame
    }
}