import { useState, useMemo, useEffect } from 'react'
import light from './light/vars'
import dark from './dark/vars'
import $EB from '@/utils/EventBus'
import store from '@/redux/store'
import Theme from '@/utils/theme'

const themes = {
    'light': light,
    'dark': dark
}

export const themeChange = function (theme: 'light' | 'dark') {
    $EB.emit($EB.TYPES.THEME_CHANGE, theme)
    Theme(theme)
}


export function useTheme() {
    const [theme, setTheme] = useState<'light' | 'dark'>(store.getState().app.theme)
    useEffect(() => {
        $EB.on($EB.TYPES.THEME_CHANGE, setTheme)
        return () => $EB.un($EB.TYPES.THEME_CHANGE, setTheme)
    }, [])
    return themes[theme]
}

export function makeStyles<
    K extends string = string
>(style: (theme: Theme) => JssSheet<K>) {
    return function useStyle() {

        const theme = useTheme()

        return useMemo(() => {
            return style(theme)
        }, [theme])
    }
}
