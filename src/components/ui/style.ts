export const RaList = {
    styleOverrides: {
        root: {
            '& .RaList-content': {
                backgroundColor: 'none',
                boxShadow: 'none',
            },
        },
    },
};

export const RaDatagrid = {
    styleOverrides: {
        root: {
            '& .RaDatagrid-tableWrapper': {
                backgroundColor: '#E6F0EC',
                padding: '4px',
                borderRadius: '8px',
                boxShadow: 'none',
            },

            '& .RaDatagrid-tbody': {
                backgroundColor: 'white',

                overflow: 'hidden',
            },

            '& .RaDatagrid-headerCell': {
                height: '0px',
                backgroundColor: '#E6F0EC ',
            },
        },
    },
};
