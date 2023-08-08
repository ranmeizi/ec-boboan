function main() {
    // 参数设置 = main.html
    // 使用说明 = intr.html
    // 定时任务 = timer.html
    // 其他 = other.html
    // ui.layout("远程设置", "http://192.168.2.1:8090/");
    ui.layout("远程设置", "http://192.168.1.6:8090/");


    let storage = storages.create("pipe");
    storage.putString('mode', 'connection')
}

main();