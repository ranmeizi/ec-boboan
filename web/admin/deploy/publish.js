const { config, places } = require('./config')
const { Client } = require('ssh2');
const archiver = require('archiver');
const dayjs = require('dayjs')
const fs = require('fs')
const exec = require('child_process').execSync;
const scp = require('scp2').scp

const { name } = config
const now = dayjs().format('YYYYMMDDHHmmss')
const fileName = `${name}.${now}`

/**
 * 部署开始
 * 1.负责把dist文件打包上传
 * 2.备份
 * 3.解压
 */

async function main({
    isRunBuild = true,
    network_env = 'TEST',
    place = 'TEST'
}) {
    try {
        // 0.vite打包
        if (isRunBuild) {
            console.log('run build start')
            exec(`export NETWORK_ENV=${network_env} && npm run build`)
            console.log('run build end')
        }
        // 1.zip打包
        const rename = places[place].rename
        console.log('zip start')
        await runZip(rename)
        console.log('zip end')
        // 2.上传
        console.log('scp start')
        await runScp(places[place])
        console.log('scp end')
        // 3.ssh
        console.log('ssh start')
        await runSSH(places[place])
        console.log('ssh end')

    } catch (e) {
        console.log('error in publish.js , message', e)
    }
}

async function runZip(rename) {

    const output = fs.createWriteStream(__dirname + `/${fileName}.zip`);

    const archive = archiver('zip');

    archive.pipe(output);

    // 添加文件
    archive.directory(`${config.dir}/`, rename)
    archive.finalize();

    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject('runZip,超时')
        }, 1000 * 30);
        output.on('close', function () {
            console.log(archive.pointer() + ' total bytes');
            console.log('archiver has been finalized and the output file descriptor has closed.');
            clearTimeout(timer)
            resolve()
        });
    })
}

async function runScp(pConfig) {
    return new Promise((resolve, reject) => {
        scp(__dirname + `/${fileName}.zip`, {
            host: pConfig.host,
            username: pConfig.username,
            password: pConfig.password,
            path: config.scpTargetPath
        }, function (err) {
            // 删除文件
            fs.unlinkSync(__dirname + `/${fileName}.zip`)
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

function runSSH(pConfig) {
    const conn = new Client();
    return new Promise(() => {
        conn.on('ready', async () => {
            const exec = pExec(conn)
            console.log('Client :: ready');
            // 备份 不管成功与否
            await exec(`mv ${pConfig.path}/${pConfig.rename} ${pConfig.path}/${pConfig.rename}.bak.${now}`)

            // 移动压缩包
            await exec(`mv -f ${config.scpTargetPath}/${fileName}.zip ${pConfig.path}`)

            // 解压缩
            await exec(`unzip ${pConfig.path}/${fileName}.zip -d ${pConfig.path}`)

            // 删除压缩包
            await exec(`rm ${pConfig.path}/${fileName}.zip`)

            // 关闭连接
            conn.end();
        }).connect({
            host: pConfig.host,
            port: pConfig.port,
            username: pConfig.username,
            password: pConfig.password
        });
    })
}

function pExec(conn) {
    return text => new Promise((resolve, reject) => {
        conn.exec(text, (err, stream) => {
            if (err) {
                reject(err)
            }
            stream.on('close', (code, signal) => {
                console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
                resolve()
            }).on('data', (data) => {
                console.log('STDOUT: ' + data);
            }).stderr.on('data', (data) => {
                console.log('STDERR: ' + data);
            });
        });
    })
}

module.exports = main