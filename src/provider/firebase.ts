import {
    FirebaseAuthProvider,
    FirebaseDataProvider,
    RAFirebaseOptions,
} from 'react-admin-firebase';
import configProd from './config/prod.json';
import configDev from './config/dev.json';
import CustomProviders from './customProviders';
import firebase from 'firebase/compat/app';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { MODE } from '../Utils/helpers';
import { kMode } from '../config';
import { DataProvider } from 'react-admin';
export const FieldValue = firebase.firestore.FieldValue;
export const FieldPath = firebase.firestore.FieldPath;

const env = process.env.REACT_APP_ENV;
export const isProd = kMode === MODE.PROD || env === 'production';

const authOptions = {};

export const authProvider = isProd
    ? FirebaseAuthProvider(configProd, authOptions)
    : FirebaseAuthProvider(configDev, authOptions);

const options: RAFirebaseOptions = {
    rootRef: `institutes/mbcet`,
    // TODO: Enable when lazyLoading supports filtering
    // lazyLoading: { enabled: true },
    // firestoreCostsLogger: { enabled: isProd ? false : true },
};

export const dataProviderLegacy = isProd
    ? FirebaseDataProvider(configProd, options)
    : FirebaseDataProvider(configDev, options);

export const db = dataProviderLegacy.app.firestore();
export const cloudFunctions = getFunctions();

if (kMode === MODE.EMULATOR && env !== 'production' && env !== 'development') {
    firebase.firestore().useEmulator('localhost', 8090);
    connectFunctionsEmulator(cloudFunctions, 'localhost', 5001);
    firebase.auth().useEmulator('http://localhost:9099/');
    //firebase.storage().useEmulator("localhost", 9199);
}

const getCustomConvertor = async (resource: string, params: any, method: keyof DataProvider) => {
    const provider = CustomProviders.find((e) => e.resource === resource);
    if (provider) {
        if (provider[method] !== undefined) return provider[method](resource, params);
        else if (!isProd) {
            console.warn(
                `${method}() Not Implemented For ${resource}. Using legacy call. Ignore if intended`
            );
        }
    }
    return dataProviderLegacy[method](resource, params);
};

const DataProviderCustom: DataProvider = {
    create: async (resource, params) => getCustomConvertor(resource, params, 'create'),

    delete: async (resource, params) => getCustomConvertor(resource, params, 'delete'),

    deleteMany: async (resource, params) => getCustomConvertor(resource, params, 'deleteMany'),

    getList: async (resource, params) => getCustomConvertor(resource, params, 'getList'),

    getOne: async (resource, params) => getCustomConvertor(resource, params, 'getOne'),

    getMany: async (resource, params) => getCustomConvertor(resource, params, 'getMany'),

    getManyReference: async (resource, params) =>
        getCustomConvertor(resource, params, 'getManyReference'),

    update: async (resource, params) => getCustomConvertor(resource, params, 'update'),

    updateMany: async (resource, params) => getCustomConvertor(resource, params, 'updateMany'),
};

export const defaultParams = {
    pagination: {
        page: 1,
        perPage: 1000,
    },
    sort: { field: 'id', order: 'ASC' },
    filter: {},
};

export const dataProvider = DataProviderCustom;
