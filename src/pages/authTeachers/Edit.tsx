import SK from 'pages/source-keys';
import { Edit, required, SimpleForm, TextInput } from 'react-admin';

const AuthorizedTeacherEdit = () => (
    <Edit>
        <SimpleForm style={{ alignItems: 'stretch' }}>
            <TextInput disabled source={SK.AUTH_TEACHERS("id")} />
            <TextInput source={SK.AUTH_TEACHERS("email")} validate={required()} />
            <TextInput source={SK.AUTH_TEACHERS("userName")} label="name" validate={required()} />
            <TextInput source={SK.AUTH_TEACHERS("branch")}validate={required()} />
        </SimpleForm>
    </Edit>
);

export default AuthorizedTeacherEdit;
