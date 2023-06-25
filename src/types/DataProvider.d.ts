import { Functions } from 'firebase/functions';
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
import { FireStore } from 'react-admin-firebase/dist/misc/firebase-models';
import { IDataProvider } from 'react-admin-firebase/dist/providers/DataProvider';

interface Configuration {
    firestore: FireStore;
    dataProviderCustom: IDataProvider;
    dataProviderLegacy: IDataProvider;
    cloudFunctions: Functions;
}

export interface DataProviderCustom<T> extends DataProvider {
    resource: string;
    create?: (
        resource: string,
        params: CreateParams<T>,
        config: Configuration
    ) => Promise<CreateResult<T>>;
    delete?: (
        resource: string,
        params: DeleteParams<T>,
        config: Configuration
    ) => Promise<DeleteResult>; // Disable type
    deleteMany?: (
        resource: string,
        params: DeleteManyParams<T>,
        config: Configuration
    ) => Promise<DeleteManyResult<T>>;
    getList?: (
        resource: string,
        params: GetListParams<T>,
        config: Configuration
    ) => Promise<GetListResult<T>>;
    getOne?: (
        resource: string,
        params: GetOneParams<T>,
        config: Configuration
    ) => Promise<GetOneResult<T>>;
    getMany?: (
        resource: string,
        params: GetManyParams,
        config: Configuration
    ) => Promise<GetManyResult<T>>; // Get Many has no extension
    getManyReference?: (
        resource: string,
        params: GetManyReferenceParams<T>,
        config: Configuration
    ) => Promise<GetManyReferenceResult<T>>;
    update?: (
        resource: string,
        params: UpdateParams<T>,
        config: Configuration
    ) => Promise<UpdateResult>; // Disable type
    updateMany?: (
        resource: string,
        params: UpdateManyParams<T>,
        config: Configuration
    ) => Promise<UpdateManyResult<T>>;
}
