import { FirebaseAuthProvider, RAFirebaseOptions } from 'react-admin-firebase';
import configProd from './config/prod.json';
import configDev from './config/dev.json';
import firebase from 'firebase/compat/app';
import { MODE } from '../Utils/helpers';
import { kMode } from '../config';
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

export const authProvider = isProd
    ? FirebaseAuthProvider(configProd, authProviderOptions)
    : FirebaseAuthProvider(configDev, authProviderOptions);

export const getRootRef = (permission: { [key: string]: string }) => {
    if (!permission) return '';
    return `institutes/${permission['institute']}`;
};

export const defaultParams = {
    pagination: {
        page: 1,
        perPage: 1000,
    },
    sort: { field: 'id', order: 'ASC' },
    filter: {},
};
