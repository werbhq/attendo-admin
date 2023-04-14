// in src/MyLayout.js
import { Layout, AppBar } from 'react-admin';
import { isProd } from './../../provider/firebase';

import { ReactQueryDevtools } from 'react-query/devtools';

import { UserMenu, MenuItemLink, Title } from 'react-admin';
import { useLocation } from 'react-router-dom';

import AUIColours from './AUIComponents/colours';
import { Chip } from '@mui/material';
import ArrowRight from '@mui/icons-material/ArrowRight';
import AdbIcon from '@mui/icons-material/Adb';

const CustomAppBar = (props: any) => {
    const location = useLocation();
    const { pathname } = location;

    // Get the name of the current resource and record from the pathname
    const [, resourceName, recordId] = pathname.split('/');
    // Render the name of the resource and record in the app bar
    console.log(resourceName);
    console.log(recordId);
    return (
        <AppBar
            sx={{
                boxShadow: 'none',
                borderBottom: '1px solid ' + AUIColours.overlayDay,
                display: 'flex',
                flexGrow: 1,
                justifyContent: 'space-between',
            }}
            {...props}
        >
            {pathname !== '/' ? (
                <span style={{ display: 'flex' }}>
                    <a
                        href={'#/' + resourceName}
                        style={{
                            textDecoration: 'none',
                            whiteSpace: 'nowrap',
                            overflow: 'clip',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {resourceName.replaceAll('_', ' ').trim().charAt(0).toUpperCase() +
                            resourceName.replaceAll('_', ' ').trim().substring(1).toLowerCase()}
                    </a>
                    {recordId ? <ArrowRight /> : null}
                    {recordId !== undefined ? (
                        <span
                            style={{
                                whiteSpace: 'nowrap',
                                overflow: 'clip',
                                textOverflow: 'ellipsis',
                            }}
                        >
                            {recordId.replaceAll('%40', '@')}
                        </span>
                    ) : (
                        <></>
                    )}
                </span>
            ) : (
                <></>
            )}
            {!isProd ? (
                <div style={{ display: 'flex', columnGap: '8px', alignItems: 'center' }}>
                    {pathname === '/' ? (
                        <span
                            style={{
                                whiteSpace: 'nowrap',
                                overflow: 'clip',
                                textOverflow: 'ellipsis',
                            }}
                        >
                            {props.title}
                        </span>
                    ) : (
                        <div></div>
                    )}
                    <Chip
                        icon={<AdbIcon />}
                        color="primary"
                        label="Development"
                        sx={{
                            backgroundColor: AUIColours.onBackgroundDay,
                            color: AUIColours.onSurfaceDay,
                        }}
                    ></Chip>
                </div>
            ) : null}
            <div style={{ width: '100%' }}></div>
        </AppBar>
    );
};

export const CustomLayout = (props: any) => {
    return (
        <>
            <Layout {...props} appBar={CustomAppBar} />
            {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
        </>
    );
};
