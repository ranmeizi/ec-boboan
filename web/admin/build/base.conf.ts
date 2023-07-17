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
        port: '8090',
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