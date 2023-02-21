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
  SimpleShowLayout,
  Datagrid,
  Tab,
  TabbedShowLayout,
  NumberField,
  EmailField,
  useDataProvider,
  useUnselectAll,
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
import ClassroomSubject from "./components/ShowClassroomSubject";
import { Chip } from "@mui/material";

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

  if (semesterChoices.length === 0) {
    dataProvider
      .getOne(MAPPING.SUBJECT, {
        id: record.batch === [] ? "" : record.batch.schemeId,
      })
      .then((e) => {
        const totalSemesters = e.data.semesters.length;
        const semesters = [];
        for (let i = 0; i < totalSemesters; i++)
          semesters.push(e.data.semesters[i].semester);
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
          data[`${e.name} [${e.subject.id.toUpperCase()}]`] =
            e.percentage === -1 ? "-" : `${e.percentage}%`;
        });
        return data;
      }
    );
    if (record.isDerived) {
      jsonExport(
        dataForExport,
        {
          headers: headersReports,
        },
        (err, csv) => {
          downloadCSV(csv, `${record.id} S${record.semester} Report`);
        }
      );
    } else {
      jsonExport(
        dataForExport,
        {
          headers: headersReports,
        },
        (err, csv) => {
          downloadCSV(csv, `${record.id} S${record.batch.semester} Report`);
        }
      );
    }
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
          <SimpleShowLayout>
            <TextField source="id" />
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
              <TextField source="subject.name" label="Subject"></TextField>
            )}

            <BooleanField source="isDerived" label="Virtual Class" />
            {!!record?.isDerived && (
              <ArrayField source="Parent Classes">
                <ul style={{ padding: 0, margin: 0 }}>
                  {record.parentClasses === undefined
                    ? "-"
                    : record.parentClasses.map((e) => (
                        <Chip key={e} sx={{ ml: 0.5, mt: 1 }} label={e} />
                      ))}
                </ul>
              </ArrayField>
            )}
            {!!record?.isDerived && (
              <ArrayField source="Teachers">
                <ul style={{ padding: 0, margin: 0 }}>
                  {record.teachers === undefined
                    ? "-"
                    : record.teachers.map((e) => (
                        <Chip
                          key={e.id}
                          sx={{ ml: 0.5, mt: 1 }}
                          label={e.name}
                        />
                      ))}
                </ul>
              </ArrayField>
            )}
            {!!record?.isDerived && (
              <TextField source="semester" label="Semester" emptyText="-" />
            )}
            <FunctionField
              label="Students Count"
              render={(record) => record.students.length}
            ></FunctionField>
            <p
              class="MuiTypography-root MuiTypography-body1 RaLabeled-label css-mes6ti-MuiTypography-root"
              sx={{ fontSize: 2 }}
            >
              <span>Batch</span>
            </p>
          </SimpleShowLayout>

          <SimpleShowLayout sx={{ ml: 2, mt: -3 }}>
            <TextField source="batch.name" label="Batch Name" />
            <BooleanField source="batch.running" label="Running" />
            <TextField source="batch.schemeId" label="Scheme Id" />
            <TextField source="batch.course" label="Course" />
            <TextField source="batch.yearOfJoining" label="Year Of Joining" />
            {!record?.isDerived && (
              <TextField
                source="batch.semester"
                label="Semester"
                emptyText="-"
              />
            )}{" "}
          </SimpleShowLayout>
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
            {!!record?.isDerived ? (
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
        {!record?.isDerived && (
          <Tab label="subject" path="subject">
            <ClassroomSubject />
          </Tab>
        )}
      </TabbedShowLayout>
    </Show>
  );
};

export default ClassroomShow;
