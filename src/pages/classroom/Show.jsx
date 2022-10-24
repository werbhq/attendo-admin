import {
  Box,
  Button,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/Upload";
import jsonExport from "jsonexport/dist";
import {
  BooleanField,
  TextField,
  Show,
  FunctionField,
  ReferenceField,
  Datagrid,
  Tab,
  TabbedShowLayout,
  NumberField,
  EmailField,
  useDataProvider,
  useUnselectAll,
  SingleFieldList,
  useShowController,
  ArrayField,
  ListContextProvider,
  useList,
  useRecordSelection,
  List,
  downloadCSV,
  useNotify,
  ExportButton,
  TopToolbar,
} from "react-admin";
import { useState, useEffect } from "react";
import EditStudent from "./components/EditStudent";
import { MAPPING } from "../../provider/mapping";
import EditClassroom from "./components/EditClassroom";
import { Schemes } from "../../Utils/Schemes";
import {
  CustomStudentBulkDeleteButton,
  CustomStudentEditButton,
  CustomVirtualStudentSaveButton,
} from "./components/ShowButtons";
import AttendanceDataGrid from "./components/ShowAttendanceGrid";
import CSVReader from "react-csv-reader";

const resource = MAPPING.STUDENTS;

export const ClassroomShow = () => {
  const [studentDialouge, setStudentDialouge] = useState({
    enable: false,
    add: false,
    record: {},
  });

  const [classroomDialouge, setClassroomDialouge] = useState({
    enable: false,
    schemes: [],
  });

  const [studentVirtualDialouge, setStudentVirtualDialouge] = useState(false);

  const { record, isLoading } = useShowController();
  const dataProvider = useDataProvider();
  const notify = useNotify();

  const virtualClassEditSaveHandler = async (students = record?.students) => {
    if (!studentVirtualDialouge) {
      const classes = await Promise.all(
        record?.parentClasses?.map((e) =>
          dataProvider.getOne(MAPPING.CLASSROOMS, { id: e })
        )
      );

      const fullStudents = [];
      classes?.forEach((e) => {
        const students = e.data.students.map((_e) => ({
          ..._e,
          classId: e.data.id,
        }));
        fullStudents.push(...students);
      });

      setListData(fullStudents);
      select(record?.students.map((e) => e.id));
      setStudentVirtualDialouge(true);
    } else {
      unselectAll();
      setStudentVirtualDialouge(false);
      setListData(students);
    }
  };

  const [listData, setListData] = useState([]);
  const listContext = useList({
    data: listData,
    resource,
    sort: { field: "classId", order: "ASC" },
  });
  const [, { select }] = useRecordSelection(resource);
  const unselectAll = useUnselectAll(resource);

  if (record?.isDerived) {
    listContext.onUnselectItems = virtualClassEditSaveHandler;
  }

  const [semester, setSemester] = useState(1);
  const [semesterChoices, setSemesterChoices] = useState([]);

  if (semesterChoices.length === 0 && record?.course) {
    dataProvider.getOne(MAPPING.SEMESTERS, { id: record.course }).then((e) => {
      const { totalSemesters } = e.data;
      const semesters = [];
      for (let i = 1; i <= totalSemesters; i++) semesters.push(i);
      setSemesterChoices(semesters);
    });
  }

  useEffect(() => {
    if (isLoading === false) {
      setListData(record?.students ?? []);
      setSemester(record?.semester ?? 1);
    }
  }, [setListData, isLoading, record, setSemester]);

  const headers = ["id", "email", "regNo", "rollNo", "name", "userName"];

  const exporterReports = (data) => {
    let headersReports = ["id", "regNo", "rollNo", "name"];
    const dataForExport = data.map(
      ({ id, regNo, rollNo, name, attendance }) => {
        const data = { id, regNo, rollNo, name };
        attendance.forEach((e) => {
          data[`${e.name} [${e.subjectId.toUpperCase()}]`] =
            e.percentage === -1 ? "-" : `${e.percentage}%`;
        });
        return data;
      }
    );

    jsonExport(
      dataForExport,
      {
        headers: headersReports,
      },
      (err, csv) => {
        downloadCSV(csv, `${record.id} S${record.semester} Report`);
      }
    );
  };

  const ReporterToolBar = () => (
    <TopToolbar>
      <Stack direction="row" spacing={2}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography>Semester</Typography>
        </Box>
        <Select
          value={semester}
          label="Semester"
          onChange={(e) => setSemester(e.target.value)}
          sx={{ width: "60px" }}
        >
          {semesterChoices.map((e) => (
            <MenuItem value={e} key={e}>
              {e}
            </MenuItem>
          ))}
        </Select>
        <ExportButton />
      </Stack>
    </TopToolbar>
  );

  return (
    <Show emptyWhileLoading>
      <TabbedShowLayout>
        {/* Summary */}
        <Tab label="summary">
          <TextField source="id" />
          <ReferenceField
            source="schemeId"
            reference={MAPPING.SUBJECT}
            link="show"
          >
            <TextField source="id" />
          </ReferenceField>
          <ReferenceField
            source="course"
            reference={MAPPING.SEMESTERS}
            link="show"
          >
            <TextField source="id" />
          </ReferenceField>
          <TextField source="year" />
          <TextField source="semester" emptyText="-" />
          <FunctionField
            label="Branch"
            render={(record) => record.branch.toUpperCase()}
          ></FunctionField>
          <FunctionField
            label="Name"
            render={(record) =>
              Schemes.classNames.find(({ id }) => record.name === id).name
            }
          ></FunctionField>
          {!!record?.isDerived && (
            <TextField source="subjectName" label="Subject"></TextField>
          )}

          <BooleanField source="isDerived" label="Virtual Class" />

          {!!record?.isDerived && (
            <ArrayField source="parentClasses">
              <SingleFieldList
                sx={{
                  flexDirection: "column",
                  padding: "10px 0px",
                }}
                data={record.parentClasses.map((e) => ({ id: e }))}
                linkType={false}
              >
                <FunctionField
                  render={() => (
                    <ReferenceField
                      source="id"
                      reference={MAPPING.CLASSROOMS}
                      link="show"
                    >
                      <TextField source="id" />
                    </ReferenceField>
                  )}
                />
              </SingleFieldList>
            </ArrayField>
          )}

          <FunctionField
            label="Students Count"
            render={(record) => record.students.length}
          ></FunctionField>

          <div style={{ margin: "20px 0px" }}>
            <Stack direction="row" spacing={2}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={async () => {
                  const schemes = await dataProvider.getList(MAPPING.SUBJECT);
                  setClassroomDialouge({
                    ...classroomDialouge,
                    enable: true,
                    schemes: schemes,
                  });
                }}
              >
                Edit
              </Button>
            </Stack>
          </div>
        </Tab>

        {/* Students */}
        <Tab label="students" path="students">
          <Stack
            spacing={"10px"}
            sx={{ margin: "20px 0px" }}
            direction="row"
            justifyContent={"space-between"}
          >
            {record?.isDerived ? (
              <Button
                size="medium"
                variant="contained"
                startIcon={<EditIcon />}
                disabled={studentVirtualDialouge}
                onClick={virtualClassEditSaveHandler}
              >
                Edit Students
              </Button>
            ) : (
              <Button
                size="medium"
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  setStudentDialouge({
                    ...studentDialouge,
                    add: true,
                    enable: true,
                    record: {},
                  });
                }}
              >
                Add Student
              </Button>
            )}
            {!record?.isDerived && (
              <Stack spacing={"10px"} direction="row">
                <Button
                  size="medium"
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={() => {
                    jsonExport(listData, { headers }, (err, csv) => {
                      downloadCSV(csv, `${record.id}`);
                    });
                  }}
                >
                  Export
                </Button>
                <Button
                  size="medium"
                  variant="outlined"
                  startIcon={<UploadIcon />}
                >
                  <CSVReader
                    parserOptions={{
                      header: true,
                      dynamicTyping: true,
                      skipEmptyLines: true,
                    }}
                    label="Import"
                    inputStyle={{ display: "none" }}
                    onFileLoaded={async (data) => {
                      const invalidHeader = data.some(
                        (e) => Object.keys(e).sort() === headers.sort()
                      );
                      if (invalidHeader) {
                        return notify(
                          `Headers are invalid. Proper headers are ${headers.join(
                            ","
                          )}`,
                          { type: "error" }
                        );
                      }

                      await dataProvider.update(MAPPING.CLASSROOMS, {
                        id: record.id,
                        data: {
                          ...record,
                          students: data,
                        },
                      });

                      notify(
                        `Updated ${data.length} Students of ${record.id}`,
                        { type: "success" }
                      );
                      setListData(data);
                    }}
                    onError={() => {
                      notify(`Error Importing CSV`, { type: "error" });
                    }}
                  ></CSVReader>
                </Button>
              </Stack>
            )}
          </Stack>

          <ListContextProvider value={listContext}>
            <Datagrid
              sx={{ paddingTop: "30px" }}
              bulkActionButtons={
                record?.isDerived ? (
                  studentVirtualDialouge && (
                    <CustomVirtualStudentSaveButton
                      list={listData}
                      callback={virtualClassEditSaveHandler}
                    />
                  )
                ) : (
                  <CustomStudentBulkDeleteButton />
                )
              }
            >
              <NumberField source="rollNo" />
              {record?.isDerived && (
                <ReferenceField
                  source="classId"
                  reference={MAPPING.CLASSROOMS}
                  link="show"
                >
                  <TextField source="id" />
                </ReferenceField>
              )}
              <TextField source="regNo" />
              <TextField source="name" />
              <EmailField source="email" />
              <TextField source="userName" />
              {!record?.isDerived && (
                <CustomStudentEditButton
                  state={{
                    dialouge: studentDialouge,
                    setdialouge: setStudentDialouge,
                  }}
                />
              )}
            </Datagrid>
          </ListContextProvider>
        </Tab>

        {/* Reports */}
        {!record?.isDerived && (
          <Tab label="reports" path="reports">
            <List
              resource={MAPPING.REPORTS}
              filter={{ semester, classroomId: record?.id }}
              pagination={false}
              exporter={exporterReports}
              actions={<ReporterToolBar />}
              empty={false}
            >
              <AttendanceDataGrid />
            </List>
          </Tab>
        )}

        {/* Popup */}
        {studentDialouge.enable && (
          <EditStudent
            state={{
              dialouge: studentDialouge,
              setdialouge: setStudentDialouge,
            }}
          />
        )}
        {classroomDialouge.enable && (
          <EditClassroom
            state={{
              dialouge: classroomDialouge,
              setdialouge: setClassroomDialouge,
            }}
          />
        )}
      </TabbedShowLayout>
    </Show>
  );
};

export default ClassroomShow;
