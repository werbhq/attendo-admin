import { GetListParams } from 'react-admin';
import { sorter } from './sorter';

export function paginateSingleDoc(params: GetListParams, data: any[]) {
    const { page, perPage } = params.pagination;
    const start = page === 1 ? 0 : (page - 1) * perPage;
    const sorted = sorter(params, data);
    const parsedData = sorted.slice(start, start + perPage);
    return parsedData;
}
