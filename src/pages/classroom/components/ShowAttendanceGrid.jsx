import {
  Datagrid,
  DatagridBody,
  TextField,
  RecordContextProvider,
  NumberField,
} from "react-admin";
import { TableCell, TableHead, TableRow, Typography } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import React from "react";

const convertToTitleCase = (word) => {
  const result = word.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};

const MyDatagridRow = ({ record, id, children }) => (
  <RecordContextProvider value={record}>
    <TableRow>
      {React.Children.map(children, (field) => (
        <TableCell key={`${id}-${field.props.source}`}>{field}</TableCell>
      ))}
      {record.attendance
        .sort(({ name: a }, { name: b }) => a?.localeCompare(b))
        .map((e) => {
          return (
            <TableCell key={`${e.subjectId}`}>
              <Tooltip title={`${e.name} (${e.subjectId.toUpperCase()})`}>
                <Typography variant="subtitle">
                  <span
                    style={{
                      color:
                        e.percentage < 70 && e.percentage !== -1
                          ? "red"
                          : "black",
                    }}
                  >
                    {e.percentage !== -1
                      ? `${Math.round(e.percentage, 2)}%`
                      : "-"}
                  </span>
                </Typography>
              </Tooltip>
            </TableCell>
          );
        })}
    </TableRow>
  </RecordContextProvider>
);

const DatagridHeader = (props) => {
  const children = props.children;
  const subjects = props.data[0].attendance.map(({ subjectId, name }) => ({
    id: subjectId.toUpperCase(),
    name,
  }));

  return (
    <TableHead>
      <TableRow>
        {children.map((field) => (
          <TableCell key={field.props.source}>
            {convertToTitleCase(field.props.source)}
          </TableCell>
        ))}
        {subjects
          .sort(({ name: a }, { name: b }) => a?.localeCompare(b))
          .map(({ name, id }) => (
            <TableCell key={id}>
              <Tooltip title={name}>
                <Typography variant="subtitle">
                  {`${name
                    .split(" ")
                    .map((e) => e[0])
                    .filter((e) => ![")", "("].includes(e))
                    .join("")} (${id})`}
                </Typography>
              </Tooltip>
            </TableCell>
          ))}
      </TableRow>
    </TableHead>
  );
};

const MyDatagridBody = (props) => (
  <DatagridBody {...props} row={<MyDatagridRow />} />
);
const MyDatagrid = (props) => (
  <Datagrid {...props} body={<MyDatagridBody />} header={<DatagridHeader />} />
);

const AttendanceDataGrid = () => (
  <MyDatagrid optimized>
    <NumberField source="rollNo" />
    <TextField source="name" />
  </MyDatagrid>
);

export default AttendanceDataGrid;
