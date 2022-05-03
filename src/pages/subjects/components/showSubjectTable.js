import {
  TextField,
  Datagrid,
  EditButton,
  useRecordContext,
  ListContextProvider,
  useList,
} from "react-admin";
import InputLabel from "@mui/material/InputLabel";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import { useState } from "react";

const SubjectTable = () => {
  const data = useRecordContext();
  const [semesterData, setsemesterData] = useState(data.semesters[0]);
  const [branch, setBranch] = useState(semesterData.branchSubs[0].branch);
  const tableData = useList({
    data: semesterData.branchSubs.find((e) => e.branch === branch).subjects,
  });

  return (
    <Stack spacing={5}>
      <Stack direction="row" spacing={2}>
        <Stack>
          <InputLabel id="semester-label">Semester</InputLabel>
          <Select
            labelId="semester-label"
            value={semesterData.semester}
            defaultValue={semesterData.semester}
            label="Semester"
            variant="standard"
            onChange={(value) =>
              setsemesterData(
                data.semesters.find((e) => e.semester === value.target.value)
              )
            }
          >
            {data.semesters.map((e) => (
              <MenuItem value={e.semester}>{e.semester}</MenuItem>
            ))}
          </Select>
        </Stack>
        <Stack>
          <InputLabel id="branch-label">Branch</InputLabel>
          <Select
            labelId="branch-label"
            value={branch}
            defaultValue={branch}
            label="Branch"
            variant="standard"
            onChange={(e) => setBranch(e.target.value)}
          >
            {semesterData.branchSubs.map((e) => (
              <MenuItem value={e.branch}>{e.branch.toUpperCase()}</MenuItem>
            ))}
          </Select>
        </Stack>
      </Stack>
      <ListContextProvider value={tableData} emptyWhileLoading>
        <Datagrid>
          <TextField source="code" />
          <TextField source="name" />
          <EditButton />
        </Datagrid>
      </ListContextProvider>
    </Stack>
  );
};

export default SubjectTable;
