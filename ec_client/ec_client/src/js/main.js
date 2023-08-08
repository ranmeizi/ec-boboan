var UniqueId = undefined

function main() {
    let storage = storages.create("pipe");
    let value = storage.getString('mode')

    // ui 层控制 main函数执行和循环结束
    // while (true) {
    //     sleep(1000)
    // }
    // let a = ui.findViewByTag('name')
    // console.log('eventdom')
    // console.log(java.__proto__)
    // console.log(Object.keys(java))
    // console.log(java.io.ByteArrayInputStream([65, 66, 67, 68, 69]))
    
    EB.on("identity",function(data){
        console.log('eb ,identity')
        UniqueId = data.data.id
    })
    Frame.init()
    // logd('down')
    Connection.run()

   
}

/** 脚本停止 */
function stop() {
    run = false
}

main();