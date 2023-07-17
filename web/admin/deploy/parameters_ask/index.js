var inquirer = require('inquirer');
var { places } = require('../config')

const q1 = {
    type: 'list',
    name: 'isRunBuild',
    choices: [
        { name: '我需要', value: true },
        { name: '我已经build好了', value: false }
    ],
    message: `【1】需要 run build 吗？`
}

const q1_1 = {
    type: 'list',
    name: 'network_env',
    choices: [
        { name: 'TEST', value: 'TEST' },
        { name: 'UAT', value: 'UAT' }
    ],
    message: `【1-1】要使用什么 NETWORK_ENV 值部署？`
}

const q2 = {
    type: 'list',
    name: 'place',
    choices: Object.keys(places).map(k => (
        { name: k, value: k }
    )),
    message: `【2】部署到什么位置？`
}



module.exports = async function ask() {
    let parameter = {}
    const { isRunBuild } = await inquirer.prompt([q1])
    parameter.isRunBuild = isRunBuild

    if (isRunBuild) {
        const { network_env } = await inquirer.prompt([q1_1])
        parameter.network_env = network_env
    }

    const { place } = await inquirer.prompt([q2])
    parameter.place = place

    return parameter
}
