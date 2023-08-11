var control = (function () {

    EB.on('controlTouchEvent', function (data) {
        const { type, x, y } = data
        switch (type) {
            case 'touchDown':
                touchDown(x, y); break;
            case 'touchMove':
                touchMove(x, y); break;
            case 'touchUp':
                touchUp(x, y); break;
        }
    })

    EB.on('controlActionEvent', (data) => {
        const { type, data: _data } = data
        //'keyboard' | 'keyboardCode' | 'systemHome' | 'systemBack' | 'systemRecent',
        switch (type) {
            case 'keyboard':
                ; break;
            case 'keyboardCode':
                ; break;
            case 'systemHome':
                home(); break;
            case 'systemBack':
                back(); break;
            case 'systemRecent':
                recentApps(); break;
        }
    })


    return {}
})()