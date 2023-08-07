declare var OK: 0

declare namespace Res {
    type Data<T> = {
        code: number
        msg: string
        data: T | null
    }
}