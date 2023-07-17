const fs = require('fs')
const path = require('path')

// 项目名
const projectName = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json'))).name

module.exports.config = {
    name: projectName,
    dir: 'dist',
    scpTargetPath: '/tmp'
}

// 部署地址
module.exports.places = {
    TEST: {
        host: '127.0.0.1',
        port: 22,
        username: 'user',
        password: 'password',
        path: '/home/room/chair',
        rename: 'rvt_test'
    },
    UAT: {
        host: '127.0.0.1',
        port: 22,
        username: 'user',
        password: 'password',
        path: '/home/room/chair',
        rename: 'rvt_uat'
    }
}
