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

    return {}
})()