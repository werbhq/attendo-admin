// in src/MyLayout.js
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
