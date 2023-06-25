import { useState } from 'react';
import { FirebaseDataProvider } from 'react-admin-firebase';
import { DataProvider } from 'react-admin';
import { QueryClient } from 'react-query';
import { dataProviderOptions, environment, getRootRef, isProd } from 'provider/firebase';
import firebase from 'firebase/compat/app';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { IDataProvider } from 'react-admin-firebase/dist/providers/DataProvider';
import { ReactAdminFirebaseAuthProvider } from 'react-admin-firebase/dist/providers/AuthProvider';
import configProd from '../config/prod.json';
import configDev from '../config/dev.json';
import { kMode } from '../../config';
import { MODE } from '../../Utils/helpers';
import CustomProviders from '../customProviders';

export const FieldValue = firebase.firestore.FieldValue;
export const FieldPath = firebase.firestore.FieldPath;

const useDataProviderCustom = (queryClient: QueryClient) => {
    const [dataProvider, setDataProvider] = useState<IDataProvider | undefined>(undefined);

    const initializeDataProvider = (authProvider: ReactAdminFirebaseAuthProvider) => {
        authProvider.getPermissions({}).then((permission) => {
            const rootRef = getRootRef(permission);
            const newOptions = { ...dataProviderOptions, rootRef };

            const dataProviderLegacy = isProd
                ? FirebaseDataProvider(configProd, newOptions)
                : FirebaseDataProvider(configDev, newOptions);

            const cloudFunctions = getFunctions();

            const customConvertor = async (
                resource: string,
                params: any,
                method: keyof DataProvider
            ) => {
                const providerCustom = CustomProviders.find((e) => e.resource === resource);

                if (providerCustom) {
                    if (providerCustom[method] !== undefined)
                        return providerCustom[method](resource, params, providers);
                    else if (!isProd) {
                        console.warn(
                            `${method}() Not Implemented For ${resource}. Using legacy call. Ignore if intended`
                        );
                    }
                }
                return dataProviderLegacy[method](resource, params);
            };

            const dataProviderCustom: IDataProvider = {
                app: dataProviderLegacy.app,

                create: async (resource, params) => customConvertor(resource, params, 'create'),

                delete: async (resource, params) => customConvertor(resource, params, 'delete'),

                deleteMany: async (resource, params) =>
                    customConvertor(resource, params, 'deleteMany'),

                getList: async (resource, params) => customConvertor(resource, params, 'getList'),

                getOne: async (resource, params) => customConvertor(resource, params, 'getOne'),

                getMany: async (resource, params) => customConvertor(resource, params, 'getMany'),

                getManyReference: async (resource, params) =>
                    customConvertor(resource, params, 'getManyReference'),

                update: async (resource, params) => customConvertor(resource, params, 'update'),

                updateMany: async (resource, params) =>
                    customConvertor(resource, params, 'updateMany'),
            };

            // Define it here even though its used early
            const providers = {
                dataProviderLegacy,
                dataProviderCustom,
                firebaseCollection: (path: string) =>
                    dataProviderCustom.app
                        .firestore()
                        .collection(`${getRootRef(permission)}/${path}`),
            };

            if (
                kMode === MODE.EMULATOR &&
                environment !== 'production' &&
                environment !== 'development'
            ) {
                firebase.firestore().useEmulator('localhost', 8090);
                connectFunctionsEmulator(cloudFunctions, 'localhost', 5001);
                firebase.auth().useEmulator('http://localhost:9099/');
                //firebase.storage().useEmulator("localhost", 9199);
            }

            setDataProvider(dataProviderCustom);
            queryClient.clear();
            queryClient.invalidateQueries().then((_) => {});
        });
    };

    return { dataProvider, initializeDataProvider };
};

export default useDataProviderCustom;
