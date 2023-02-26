// in src/MyLayout.js
import * as React from 'react';
import { Layout } from 'react-admin';

import { ReactQueryDevtools } from 'react-query/devtools';

export const CustomLayout = (props: any) => {
    return (
        <>
            <Layout {...props} />
            {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
        </>
    );
};
