import * as React from "react";
import Dialog from "@mui/material/Dialog";
import { useState } from "react";
import {
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
  SelectInput,
  BooleanInput,
} from "react-admin";
import {
  Box,
  Stack,
} from "@mui/material";
import { MAPPING } from "../../../provider/mapping";
import { autoCapitalize } from "../../../Utils/helpers";
import { Schemes } from "../../../Utils/Schemes";
const resource = MAPPING.BATCHES;

export default function EditSummary({ state }) {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();
  const redirect = useRedirect();
  const record = useRecordContext();
  const { setdialouge, dialouge } = state;

  const [schemeData, setSchemeData] = useState([]);
  const { getSemesters } = new Schemes(schemeData);
  dataProvider.getList(MAPPING.SUBJECT).then((e) => {
    setSchemeData(e.data);
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
        <TextInput source="name" format={autoCapitalize} disabled={true} />

        <SelectInput
          source="semester"
          choices={getSemesters(record.schemeId)}
          required
        />
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <BooleanInput source="running" validate={[required()]} />
        </Box>
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
