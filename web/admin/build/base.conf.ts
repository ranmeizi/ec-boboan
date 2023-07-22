/*
 * @Author: boboan 360969885@qq.com
 * @Date: 2023-07-17 10:52:41
 * @LastEditors: boboan 360969885@qq.com
 * @LastEditTime: 2023-07-21 10:05:57
 * @FilePath: /admin/build/base.conf.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import path from 'path'
import autoprefixer from 'autoprefixer'

const postcssOpts = {
    ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
    plugins: () => [
        autoprefixer({
            overrideBrowserslist: [
                "Android 4.1",
                "iOS 7.1",
                "Chrome > 31",
                "ff > 31",
                "ie >= 8"
            ],
            grid: true
        })
    ],
};

export default {
    postcss: postcssOpts,
    base: '/',
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true
            }
        }
    },
    define: {
        'process.env.NETWORK_ENV': JSON.stringify(process.env.NETWORK_ENV)
    },
    plugins: [

    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, "../src/")
        }
    },
    server: {
        strict: false,
        host: '0.0.0.0',
        port: '8091',
        https: false,
        proxy: {
            '/api': {
                target: 'http://jsonplaceholder.typicode.com',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            },
        },
        cors: {
            origin: ['http://wozijidehoutai.com']
        },
        historyApiFallback: true
    }
}