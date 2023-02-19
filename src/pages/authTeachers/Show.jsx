import { EmailField, Show, SimpleShowLayout, TextField, BooleanField, useRecordContext, useShowController } from "react-admin";


const AuthorizedTeacherShow = () => {

  const record=useShowController().record;
  console.log(record);

  return(
    <Show>
      <SimpleShowLayout>
        <TextField source="id" />
        <EmailField source="email" />
        <TextField source="userName" />
        <BooleanField source="created" looseValue/>
        <TextField source="branch" />
        
        {record.created &&(<button>Create Account</button>)}
        {/* <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={(e) => onClickCreateAccount(props.record)}
          >
            Create Account
          </Button> */}
      </SimpleShowLayout>
    </Show>
  );
}

export default AuthorizedTeacherShow;
