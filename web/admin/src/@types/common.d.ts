declare namespace Res {
    export type data<T> = Promise<T>;
    export type page<T> = Promise<{
        list: T[];
        total: number;
        pageSize: number;
        pageNumber: number;
    }>;

    namespace EC {
        type data<T> = {
            code: number
            data: T
            msg: string
        }

        type page<T> = data<{
            list: T[]
            total: number;
            pageSize: number;
            pageNumber: number;
        }>
    }
}

declare type PageParam = {
    pageSize: number,
    pageNum: number
}