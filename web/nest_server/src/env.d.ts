declare var OK: 200

declare namespace Res {
    type Data<T> = {
        code: number
        msg: string
        data: T | null
    }
}