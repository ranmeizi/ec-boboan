import { Tabs, Tab, styled } from '@mui/material'
import RemoteDeviceIcon from '@mui/icons-material/InstallMobile';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import React from 'react'
import { useNavigate, useOutlet } from 'react-router-dom'
import { TransitionProvider } from '@bomon/expand-router'

const Box = styled('div')({
    height: '100vh',
    width: '100vw',
    position: 'relative',

    '.bottom-tab': {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',

        '.MuiTab-root': {
            flex: 1
        }
    }
})

function LinkTab(props: any) {
    const navigate = useNavigate()
    return (
        <Tab
            component="a"
            onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                event.preventDefault();
                navigate(props.href)
            }}
            {...props}
        />
    );
}

export default function () {
    const outlet = useOutlet()
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return <Box style={{display:'flex',paddingBottom:'72px'}}>
        {/* 路由窗口 */}
        <div style={{flex:1}}>
            <TransitionProvider>
                {outlet}
            </TransitionProvider>
        </div>
        {/* tab */}
        <Tabs className='bottom-tab' value={value} onChange={handleChange} aria-label="icon label tabs example">
            <LinkTab icon={<RemoteDeviceIcon />} label="远程控制" href='/t/remote-config' />
            <LinkTab icon={<FavoriteIcon />} label="TODO" href='/t/favorites' />
            <LinkTab icon={<PersonPinIcon />} label="TODO" href='/t/nearby' />
        </Tabs>
    </Box>
}