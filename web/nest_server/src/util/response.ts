class Res {
    static data<T>(data: T, msg?: string) {
        return {
            data: data,
            code: 200,
            msg: msg || 'success'
        }
    }

    static error(msg ='') {
        return {
            code: 500,
            msg: msg
        }
    }
}

export { Res }