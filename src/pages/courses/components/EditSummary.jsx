import * as React from "react";
import Dialog from "@mui/material/Dialog";

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
import { MAPPING } from "../../../provider/mapping";
import { Stack } from "@mui/material";

const resource = MAPPING.SEMESTERS;

export default function EditSummary({ state }) {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();
  const redirect = useRedirect();
  const record = useRecordContext();
  const { setdialouge, dialouge } = state;

  const handleSave = async (data) => {
    const batches = [];
    let currentYear = new Date().getFullYear();
    for (let i = data.evenSemester ? 2 : 1; i <= data.totalSemesters; i += 2) {
      batches.push({ id: currentYear--, sem: i });
    }
    data.batches = batches.sort((a, b) => a.sem - b.sem);

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

  const evenOnlyValidation = (value) => {
    if (value % 2 !== 0) return "Even Numbers Only!";
    else return undefined;
  };

  const nonZeroValidation = (value) => {
    if (value <= 0) return "Positive Numbers Only!";
    else return undefined;
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
        <TextInput source="id" disabled />
        <NumberInput
          source="totalSemesters"
          onWheel={(e) => e.preventDefault()}
          validate={[
            required(),
            number("Not a number"),
            nonZeroValidation,
            evenOnlyValidation,
          ]}
        />
        <BooleanInput source="evenSemester" validate={[required()]} />
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
