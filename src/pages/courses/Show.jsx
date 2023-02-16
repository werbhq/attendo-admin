import { Button, Stack } from "@mui/material";
import {
  Show,
  Tab,
  TabbedShowLayout,
  TextField,
  ArrayField,
  ChipField,
  FunctionField,
  SingleFieldList,
  useShowController,
  BooleanField,
} from "react-admin";

import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import EditSummary from "./components/EditSummary";
import EditActiveSemester from "./components/EditActiveSemester";

const CourseShow = () => {
  const { record } = useShowController();
  const [summaryDialouge, setSummaryDialouge] = useState({ enable: false });

  return (
    <Show>
      <TabbedShowLayout>
        <Tab label="summary">
          <TextField source="id" label="Course" />
          <TextField source="totalSemesters" label="TotalSemesters" />
          <BooleanField source="evenSemester" />
          <ArrayField source="batches">
            {record?.batches?.length !== 0 ? (
              <SingleFieldList>
                <FunctionField
                  render={(record) => (
                    <ChipField
                      record={{ sem: `S${record.sem}` }}
                      source="sem"
                    />
                  )}
                />
              </SingleFieldList>
            ) : (
              <>-</>
            )}
          </ArrayField>

          <div style={{ margin: "20px 0px" }}>
            <Stack direction="row" spacing={2}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={async () => {
                  setSummaryDialouge({ ...summaryDialouge, enable: true });
                }}
              >
                Edit
              </Button>
            </Stack>
          </div>
        </Tab>
        <Tab label="Active Semesters" path="active_semester">
          <EditActiveSemester />
        </Tab>
        {summaryDialouge.enable && (
          <EditSummary
            state={{
              dialouge: summaryDialouge,
              setdialouge: setSummaryDialouge,
            }}
          />
        )}
      </TabbedShowLayout>
    </Show>
  );
};

export default CourseShow;
