type Join<K, P> = K extends string | number
    ? P extends string | number
        ? `${K}${'' extends P ? '' : '.'}${'' extends P ? '' : P}`
        : never
    : never;

export type SourceKeys<T, D extends number = 10> = [D] extends [never]
    ? never
    : T extends object
    ? {
          [K in keyof T]-?: K extends string | number
              ? `${K}` | Join<K, SourceKeys<T[K], Prev[D]>>
              : never;
      }[keyof T]
    : '';
