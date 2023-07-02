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
import { FireStoreCollectionRef } from 'react-admin-firebase/dist/misc/firebase-models';
import { IDataProvider } from 'react-admin-firebase/dist/providers/DataProvider';

interface Providers {
    dataProviderCustom: IDataProvider;
    dataProviderLegacy: IDataProvider;
    firebaseCollection: (path: string) => FireStoreCollectionRef;
}

export interface DataProviderCustom<T> extends DataProvider {
    resource: string;
    create?: (
        resource: string,
        params: CreateParams<T>,
        providers: Providers
    ) => Promise<CreateResult<T>>;
    delete?: (
        resource: string,
        params: DeleteParams<T>,
        providers: Providers
    ) => Promise<DeleteResult>; // Disable type
    deleteMany?: (
        resource: string,
        params: DeleteManyParams<T>,
        providers: Providers
    ) => Promise<DeleteManyResult<T>>;
    getList?: (
        resource: string,
        params: GetListParams<T>,
        providers: Providers
    ) => Promise<GetListResult<T>>;
    getOne?: (
        resource: string,
        params: GetOneParams<T>,
        providers: Providers
    ) => Promise<GetOneResult<T>>;
    getMany?: (
        resource: string,
        params: GetManyParams,
        providers: Providers
    ) => Promise<GetManyResult<T>>; // Get Many has no extension
    getManyReference?: (
        resource: string,
        params: GetManyReferenceParams<T>,
        providers: Providers
    ) => Promise<GetManyReferenceResult<T>>;
    update?: (
        resource: string,
        params: UpdateParams<T>,
        providers: Providers
    ) => Promise<UpdateResult>; // Disable type
    updateMany?: (
        resource: string,
        params: UpdateManyParams<T>,
        providers: Providers
    ) => Promise<UpdateManyResult<T>>;
}
