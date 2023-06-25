import { FirebaseAuthProvider, RAFirebaseOptions } from 'react-admin-firebase';
import configProd from './config/prod.json';
import configDev from './config/dev.json';
import firebase from 'firebase/compat/app';
import { MODE } from '../Utils/helpers';
import { kMode } from '../config';
import { ReactAdminFirebaseAuthProvider } from 'react-admin-firebase/dist/providers/AuthProvider';
export const FieldValue = firebase.firestore.FieldValue;
export const FieldPath = firebase.firestore.FieldPath;

export const environment = process.env.REACT_APP_ENV;
export const isProd = kMode === MODE.PROD || environment === 'production';

const authProviderOptions = {};
export const dataProviderOptions: RAFirebaseOptions = {
    // TODO: Enable when lazyLoading supports filtering
    // lazyLoading: { enabled: true },
    // firestoreCostsLogger: { enabled: isProd ? false : true },
};

export const authProviderLegacy = isProd
    ? FirebaseAuthProvider(configProd, authProviderOptions)
    : FirebaseAuthProvider(configDev, authProviderOptions);

export const getRootRef = (permission: { [key: string]: string }) => {
    if (!permission) return '';
    return `institutes/${permission['institute']}`;
};

export const getCustomAuthProvider = (
    initializeDataProvider: (authProvider: ReactAdminFirebaseAuthProvider) => void
) => ({
    ...authProviderLegacy,
    login: async (data: { username: string; password: string }) => {
        await authProviderLegacy.login(data);
        initializeDataProvider(authProviderLegacy);
    },
});

export const defaultParams = {
    pagination: {
        page: 1,
        perPage: 1000,
    },
    sort: { field: 'id', order: 'ASC' },
    filter: {},
};
