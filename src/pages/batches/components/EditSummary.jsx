import * as React from "react";
import Dialog from "@mui/material/Dialog";
import { useState } from "react";
import {
  NumberInput,
  SimpleForm,
  useDataProvider,
  useRecordContext,
  useRefresh,
  useNotify,
  SaveButton,
  DeleteWithConfirmButton,
  useRedirect,
  TextInput,
  required,
  number,
  BooleanInput,
} from "react-admin";
import {
  Box,
  Button,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { MAPPING } from "../../../provider/mapping";
import { autoCapitalize } from "../../../Utils/helpers";

const resource = MAPPING.BATCHES;

export default function EditSummary({ state }) {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();
  const redirect = useRedirect();
  const record = useRecordContext();
  const { setdialouge, dialouge } = state;
  const [totalSemesters, setTotalSemesters] = useState(1);

  dataProvider.getOne(MAPPING.SEMESTERS, { id: record.course }).then((e) => {
    setTotalSemesters(e.data.totalSemesters);
  });

  const handleSave = async (data) => {
    await dataProvider.update(resource, {
      id: data.id,
      data: data,
    });

    refresh();
    notify(`Edited ${data.id}`, {
      type: "success",
    });
    setdialouge(false);
  };

  return (
    <Dialog
      open={dialouge.enable}
      onClose={() => setdialouge({ ...dialouge, enable: false })}
      fullWidth={true}
    >
      <SimpleForm
        defaultValues={record}
        toolbar={false}
        style={{ alignItems: "stretch" }}
        resource={resource}
        onSubmit={handleSave}
      >
        <TextInput source="name" format={autoCapitalize} />
        <NumberInput
          source="semester"
          onWheel={(e) => e.preventDefault()}
          validate={[required(), number("Number Required")]}
          label="Semester"
          max={totalSemesters}
        />

        <BooleanInput source="running" validate={[required()]} />
        <Stack direction="row" spacing={2}>
          <SaveButton label="Save" />
          <DeleteWithConfirmButton
            variant="outlined"
            size="medium"
            color="inherit"
            confirmTitle=""
            confirmContent="You will not be able to recover this course. Are you sure?"
            mutationOptions={{
              onSuccess: () => {
                notify("Course Deleted");
                redirect("list", resource);
              },
            }}
          />
        </Stack>
      </SimpleForm>
    </Dialog>
  );
}
