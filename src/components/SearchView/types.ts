export enum DIRECTIONS {
    FORWARD = 'forward',
    BACK = 'back',
}

export enum FilterKeys {
    from = 'from',
    to = 'to',
    date = 'date',
    passengers = 'passengers',
}

export type Filters = Record<FilterKeys, string | number | null>

export interface IStation {
    _id: string,
    name: string,
    operatorsKeys: {
        [key: string]: string
    }
}

export interface IOperator {
    _id: string,
    name: string
}