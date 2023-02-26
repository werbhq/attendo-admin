import {
    CreateParams,
    CreateResult,
    DataProvider,
    DeleteManyParams,
    DeleteParams,
    DeleteResult,
    GetListResult,
    GetManyParams,
    GetManyReferenceParams,
    GetManyReferenceResult,
    GetManyResult,
    GetOneParams,
    GetOneResult,
    UpdateManyParams,
    UpdateManyResult,
    UpdateParams,
    UpdateResult,
    DeleteManyResult,
    GetListParams,
} from 'react-admin';

export interface DataProviderCustom<T> extends DataProvider {
    resource: string;
    create?: (resource: string, params: CreateParams<T>) => Promise<CreateResult<T>>;
    delete?: (resource: string, params: DeleteParams<T>) => Promise<DeleteResult>; // Disable type
    deleteMany?: (resource: string, params: DeleteManyParams<T>) => Promise<DeleteManyResult<T>>;
    getList?: (resource: string, params: GetListParams<T>) => Promise<GetListResult<T>>;
    getOne?: (resource: string, params: GetOneParams<T>) => Promise<GetOneResult<T>>;
    getMany?: (resource: string, params: GetManyParams) => Promise<GetManyResult<T>>; // Get Many has no extension
    getManyReference?: (
        resource: string,
        params: GetManyReferenceParams<T>
    ) => Promise<GetManyReferenceResult<T>>;
    update?: (resource: string, params: UpdateParams<T>) => Promise<UpdateResult>; // Disable type
    updateMany?: (resource: string, params: UpdateManyParams<T>) => Promise<UpdateManyResult<T>>;
}
