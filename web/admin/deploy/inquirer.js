const ask = require('./parameters_ask')
const publishWithParameter = require('./publish')
/**
 * 询问
 * 收集参数
 * 交给publish处理
 */

async function main() {
    try {
        const parameter = await ask()
        await publishWithParameter(parameter)
    } catch (e) {
        console.log('error in inquirer.js , message', e)
    }
}

main()