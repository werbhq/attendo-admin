import {
  EmailField,
  Show,
  SimpleShowLayout,
  TextField,
  BooleanField,
  useShowController,
  useNotify,
} from "react-admin";
import { AuthTeachersProvider } from "../../provider/custom/authorizedTeachers";
import { Button } from "@mui/material";

const AuthorizedTeacherShow = () => {
  const { record } = useShowController();
  const notify = useNotify();

  return (
    <Show>
      <SimpleShowLayout>
        <TextField source="id" />
        <EmailField source="email" />
        <TextField source="userName" />
        <BooleanField source="created" looseValue />
        <TextField source="branch" />

        {!record.created && (
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              AuthTeachersProvider.createEmails([record.id]).then((e) => {
                notify(e.message, { type: "success" });
              })
            }
          >
            Create Account
          </Button>
        )}
      </SimpleShowLayout>
    </Show>
  );
};

export default AuthorizedTeacherShow;
