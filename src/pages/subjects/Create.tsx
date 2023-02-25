import {
    Create,
    SimpleForm,
    SelectInput,
    TextInput,
    required,
    number,
    useRefresh,
    useNotify,
    useRedirect,
    useDataProvider,
    NumberInput,
} from 'react-admin';
import { MAPPING } from '../../provider/mapping';
import { noSpaceValidation } from '../../Utils/validations';
import { SubjectDoc } from '../../types/models/subject';
import { Schemes } from '../../Utils/Schemes';
const url = MAPPING.SUBJECT;

const SubjectCreate = () => {
    const dataProvider = useDataProvider();
    const refresh = useRefresh();
    const notify = useNotify();
    const redirect = useRedirect();

    const courseChoices = Schemes.courses.map((value) => ({
        id: value,
        name: value,
    }));

    const onSubmit = async (value: any) => {
        let data = value as SubjectDoc;
        const id = `${data.course}-${data.organization}-${data.year}`;
        data = { ...data, id, semesters: [] };
        try {
            await dataProvider.create(url, { data, meta: { id: data.id } });
            notify(`Added ${id}`, { type: 'success' });
            refresh();
            redirect('list', url);
        } catch (error: any) {
            notify(error.message, { type: 'error' });
        }
    };

    return (
        <Create>
            <SimpleForm onSubmit={onSubmit}>
                <TextInput
                    source="organization"
                    format={(props) => props?.toUpperCase() ?? ''}
                    validate={[required(), noSpaceValidation]}
                />
                <NumberInput
                    source="year"
                    onWheel={(e) => e.target instanceof HTMLElement && e.target.blur()}
                    validate={[required(), number('Number Required')]}
                    label="Year"
                />
                <SelectInput
                    source="course"
                    choices={courseChoices}
                    validate={[required(), noSpaceValidation]}
                    label="Course"
                />
            </SimpleForm>
        </Create>
    );
};

export default SubjectCreate;
