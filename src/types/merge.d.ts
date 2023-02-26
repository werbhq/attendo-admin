/* eslint-disable no-use-before-define */
/**
 * This is a helper type
 * Do not mody
 */
type _Primitive = string | number | boolean | bigint | symbol | null | undefined;
type _Expand<T> = T extends _Primitive ? T : { [K in keyof T]: T[K] };

type _OptionalKeys<T> = {
    [K in keyof T]-?: T extends Record<K, T[K]> ? never : K;
}[keyof T];

type _RequiredKeys<T> = {
    [K in keyof T]-?: T extends Record<K, T[K]> ? K : never;
}[keyof T] &
    keyof T;

type _RequiredMergeKeys<T, U> = _RequiredKeys<T> & _RequiredKeys<U>;

type _OptionalMergeKeys<T, U> =
    | _OptionalKeys<T>
    | _OptionalKeys<U>
    | Exclude<_RequiredKeys<T>, _RequiredKeys<U>>
    | Exclude<_RequiredKeys<U>, _RequiredKeys<T>>;

type _MergeNonUnionObjects<T, U> = _Expand<
    {
        [K in _RequiredMergeKeys<T, U>]: _Expand<Merge<T[K], U[K]>>;
    } & {
        [K in _OptionalMergeKeys<T, U>]?: K extends keyof T
            ? K extends keyof U
                ? _Expand<Merge<Exclude<T[K], undefined>, Exclude<U[K], undefined>>>
                : T[K]
            : K extends keyof U
            ? U[K]
            : never;
    }
>;

type _MergeNonUnionArrays<T extends readonly any[], U extends readonly any[]> = Array<_Expand<Merge<T[number], U[number]>>>;

type _MergeArrays<T extends readonly any[], U extends readonly any[]> = [T] extends [never]
    ? U extends any
        ? _MergeNonUnionArrays<T, U>
        : never
    : [U] extends [never]
    ? T extends any
        ? _MergeNonUnionArrays<T, U>
        : never
    : T extends any
    ? U extends any
        ? _MergeNonUnionArrays<T, U>
        : never
    : never;

type _MergeObjects<T, U> = [T] extends [never]
    ? U extends any
        ? _MergeNonUnionObjects<T, U>
        : never
    : [U] extends [never]
    ? T extends any
        ? _MergeNonUnionObjects<T, U>
        : never
    : T extends any
    ? U extends any
        ? _MergeNonUnionObjects<T, U>
        : never
    : never;

export type Merge<T, U> =
    | Extract<T | U, _Primitive>
    | _MergeArrays<Extract<T, readonly any[]>, Extract<U, readonly any[]>>
    | _MergeObjects<Exclude<T, _Primitive | readonly any[]>, Exclude<U, _Primitive | readonly any[]>>;
