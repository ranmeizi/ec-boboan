
function main() {
    let storage = storages.create("pipe");
    let value = storage.getString('mode')

    // ui 层控制 main函数执行和循环结束
    // while (true) {
    //     sleep(1000)
    // }

    // logd('down')
    Connection.run()
}

/** 脚本停止 */
function stop() {
    run = false
}

main();