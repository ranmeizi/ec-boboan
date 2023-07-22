import Page from "@/components/Page";
import React, { useEffect, useState } from "react";
import { Button, TextField } from '@mui/material';

export default function RemoteConfig() {
  const [remoteAddr, setRemoteAddr] = useState('')
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const el = document.querySelector('#event-dom')
    function onConnected() {
      setConnected(true)
    }

    el?.addEventListener('onConnection', onConnected)
    return () => {
      el?.removeEventListener('onConnected', onConnected)
    }
  }, [])

  function handleConnect() {

  }

  function handleDisconnect() {

  }

  return (
    <Page sx={theme => ({
      padding: theme.spacing(2)
    })}>
      <div className="full-width">
        <TextField
          label="websocket地址"
          id="outlined-size-small"
          defaultValue="Small"
          size="small"
        />
        <div>
          <Button onClick={() => window.ec.start()}>RunScript</Button>
          <Button disabled={!connected} onClick={handleConnect}>上线设备</Button>
          <Button disabled={connected} onClick={handleDisconnect}>下线设备</Button>
        </div>
      </div>

    </Page>
  );
}
