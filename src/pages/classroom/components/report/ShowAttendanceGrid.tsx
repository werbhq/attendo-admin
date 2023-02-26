import { Datagrid, DatagridBody, TextField, RecordContextProvider, NumberField } from 'react-admin';
import { TableCell, TableHead, TableRow, Typography } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

import { titleCase } from '../../../../Utils/helpers';
import { AttendanceReportResponseFrontEnd } from '../../../../types/models/attendance';
import React from 'react';

const MyDatagridRow = ({
    record,
    id,
    children,
}: {
    record?: AttendanceReportResponseFrontEnd;
    id?: string;
    children?: any[];
}) => (
    <RecordContextProvider value={record}>
        <TableRow>
            {React.Children?.map(children, (field) => (
                <TableCell key={`${id}-${field.props.source}`}>{field}</TableCell>
            ))}
            {record?.attendance
                .sort(({ name: a }, { name: b }) => a?.localeCompare(b))
                .map((e) => {
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

const DatagridHeader = (props: { children?: any[]; data?: AttendanceReportResponseFrontEnd[] }) => {
    const children = props.children;

    const subjects =
        props.data && props.data?.length !== 0
            ? props.data[0].attendance.map(({ subjectId, name }) => ({
                  id: subjectId.toUpperCase(),
                  name,
              }))
            : [];

    return (
        <TableHead>
            <TableRow>
                {children?.map((field) => (
                    <TableCell key={field.props.source}>{titleCase(field.props.source)}</TableCell>
                ))}
                {subjects
                    .sort(({ name: a }, { name: b }) => a?.localeCompare(b))
                    .map(({ name, id }) => (
                        <TableCell key={id}>
                            <Tooltip title={name}>
                                <Typography variant="body2">
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

const MyDatagridBody = (props: any) => <DatagridBody {...props} row={<MyDatagridRow />} />;
const MyDatagrid = (props: any) => (
    <Datagrid {...props} body={<MyDatagridBody />} header={<DatagridHeader />} />
);

const AttendanceDataGrid = () => (
    <MyDatagrid optimized>
        <NumberField source="rollNo" />
        <TextField source="name" />
    </MyDatagrid>
);

export default AttendanceDataGrid;
