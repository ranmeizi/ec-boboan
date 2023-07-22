class Res {
    static data<T>(data: T, msg?: string) {
        return {
            data: data,
            code: 200,
            msg: msg || 'success'
        }
    }

    static error() {
        return {
            code: 500,
            msg: ''
        }
    }
}

export { Res }