import { GetListParams, RaRecord } from 'react-admin';

/**
 * Sorter for getList data
 */
export function sorter<T extends RaRecord>(params: GetListParams, data: T[]) {
    const sort = params?.sort;
    const filters = params?.filter as { [key: string]: any };

    if (sort) {
        const field = sort.field;

        if (Array.isArray(data)) {
            data = data.sort((a, b) => {
                if (typeof a[field] === 'string') {
                    if (sort.order === 'DESC') return b[field]?.localeCompare(a[field]);
                    return a[field]?.localeCompare(b[field]);
                } else if (typeof a[field] === 'number') {
                    if (sort.order === 'DESC') return b[field] - a[field];
                    return a[field] - b[field];
                } else if (typeof a.id === 'string' && typeof b.id === 'string') {
                    return a.id.localeCompare(b.id as string);
                }

                return true;
            });
        }
    }

    if (filters && Object.entries(filters).length) {
        Object.entries(filters).forEach(([e_field, value]) => {
            data = data.filter((e) => {
                if (typeof e[e_field] === 'string' || typeof e[e_field] === 'number') {
                    return `${e[e_field]}`.toUpperCase().includes(value.toUpperCase());
                } else if (Array.isArray(e[e_field])) {
                    return e[e_field].includes(value);
                } else if (typeof e[e_field] === 'boolean') {
                    return e[e_field] === value;
                }
                return true;
            });
        });
    }

    return data;
}
