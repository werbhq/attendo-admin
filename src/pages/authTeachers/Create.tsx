import {
    Create,
    email,
    required,
    SimpleForm,
    TextInput,
    useDataProvider,
    useNotify,
    useRedirect,
    useRefresh,
    useUpdate,
} from 'react-admin';
import { MAPPING } from 'provider/mapping';
import { defaultParams } from 'provider/firebase';
import { validateName } from 'Utils/helpers';

const url = MAPPING.AUTH_TEACHERS;

const AuthorizedTeacherCreate = () => {
    const [update] = useUpdate();
    const refresh = useRefresh();
    const notify = useNotify();
    const redirect = useRedirect();
    const dataProvider = useDataProvider();
    const onSubmit = (data: any) => {
        let isUpdate;
        data = { ...data, id: data.email, created: false };
        dataProvider.getList(url, defaultParams).then((e) => {
            console.log(e.data.includes(data));
            if (e.data.includes(data)) isUpdate = false;
            else isUpdate = true;
        });
        if (isUpdate === true)
            update(
                url,
                { id: data.id, data },
                {
                    onSuccess: () => {
                        notify(`Added ${data.id}`, { type: 'success' });
                        refresh();
                        redirect('list', url);
                    },
                }
            );
        else {
            notify(`${data.id} is already present`, { type: 'success' });
            refresh();
            redirect('list', url);
        }
    };

    return (
        <Create>
            <SimpleForm style={{ alignItems: 'stretch' }} onSubmit={onSubmit}>
                <TextInput source="email" validate={[required(), email()]} />
                <TextInput source="userName" label="Name" validate={[required(), validateName]} />
                <TextInput source="branch" validate={required()} />
            </SimpleForm>
        </Create>
    );
};

export default AuthorizedTeacherCreate;
