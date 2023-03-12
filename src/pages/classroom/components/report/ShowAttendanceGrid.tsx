import { Datagrid, DatagridBody, TextField, RecordContextProvider, NumberField } from 'react-admin';
import { TableCell, TableHead, TableRow, Typography } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

import { titleCase } from 'Utils/helpers';
import { Report } from 'types/frontend/report';
import React from 'react';

type SortParam = { name: string; isVirtualClass: boolean };
const sorter = (a: SortParam, b: SortParam) => {
    return a.isVirtualClass === b.isVirtualClass
        ? a.name?.localeCompare(b.name)
        : a.isVirtualClass
        ? 1
        : -1;
};

const MyDatagridRow = ({
    record,
    id,
    children,
}: {
    record?: Report;
    id?: string;
    children?: any[];
}) => (
    <RecordContextProvider value={record}>
        <TableRow>
            {React.Children?.map(children, (field) => (
                <TableCell key={`${id}-${field.props.source}`}>{field}</TableCell>
            ))}
            {record?.attendance.sort(sorter).map((e) => {
                return (
                    <TableCell key={`${e.subjectId}`}>
                        <Tooltip title={`${e.name} (${e.subjectId.toUpperCase()})`}>
                            <Typography variant="body2">
                                <span
                                    style={{
                                        color:
                                            e.percentage < 70 && e.percentage !== -1
                                                ? 'red'
                                                : 'black',
                                    }}
                                >
                                    {e.percentage !== -1 ? `${Math.round(e.percentage)}%` : '-'}
                                </span>
                            </Typography>
                        </Tooltip>
                    </TableCell>
                );
            })}
        </TableRow>
    </RecordContextProvider>
);

const DatagridHeader = (props: { children?: any[]; data?: Report[] }) => {
    const children = props.children;

    const subjects =
        props.data && props.data?.length !== 0
            ? props.data[0].attendance.map(({ subjectId, name, isVirtualClass }) => ({
                  id: subjectId.toUpperCase(),
                  name,
                  isVirtualClass,
              }))
            : [];

    return (
        <TableHead
            sx={{
                position: 'sticky',
                top: 1,
                backgroundColor: 'white',
            }}
        >
            <TableRow>
                {children?.map((field) => (
                    <TableCell key={field.props.source}>{titleCase(field.props.source)}</TableCell>
                ))}
                {subjects.sort(sorter).map(({ name, id, isVirtualClass }) => (
                    <TableCell key={id}>
                        <Tooltip title={name}>
                            <Typography variant="body2" fontWeight={isVirtualClass ? '' : 'bold'}>
                                {`${name
                                    .split(' ')
                                    .map((e) => e[0])
                                    .filter((e) => ![')', '('].includes(e))
                                    .join('')} (${id})`}
                            </Typography>
                        </Tooltip>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
};

const MyDatagridBody = (props: any) => {
    return <DatagridBody {...props} sx={{ top: 20 }} row={<MyDatagridRow />} />;
};
const MyDatagrid = (props: any) => (
    <Datagrid
        {...props}
        sx={{
            '& .RaDatagrid-tableWrapper': {
                maxHeight: '70vh',
                overflow: 'scroll',
            },
        }}
        header={<DatagridHeader />}
        body={<MyDatagridBody />}
    />
);

const AttendanceDataGrid = (props: any) => (
    <MyDatagrid optimized {...props}>
        <NumberField source="rollNo" />
        <TextField source="name" />
    </MyDatagrid>
);

export default AttendanceDataGrid;
