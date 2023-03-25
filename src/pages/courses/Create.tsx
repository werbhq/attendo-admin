import {
    required,
    number,
    Create,
    SimpleForm,
    NumberInput,
    TextInput,
    useCreate,
    useRefresh,
    useNotify,
    useRedirect,
} from 'react-admin';
import { Course } from 'types/models/courses';
import { MAPPING } from 'provider/mapping';
import SK from 'pages/source-keys';

const url = MAPPING.COURSES;

const CourseCreate = () => {
    const [create] = useCreate<Course>();
    const refresh = useRefresh();
    const notify = useNotify();
    const redirect = useRedirect();

    const onSubmit = (e: any) => {
        const data = e as Course;
        create(
            url,
            { data: { ...e, id: e.id.toUpperCase() } },
            {
                onSuccess: () => {
                    notify(`Added ${data.id.toUpperCase()}`, {
                        type: 'success',
                    });
                    refresh();
                    redirect('list', url);
                },
            }
        );
    };

    return (
        <Create redirect="list">
            <SimpleForm onSubmit={onSubmit}>
                <TextInput
                    source={SK.COURSE("id")}
                    label="Course Name"
                    format={(e) => e?.toUpperCase() ?? ''}
                    validate={[required()]}
                />
                <NumberInput
                    source={SK.COURSE("totalSemesters")}
                    onWheel={(e) => e.target instanceof HTMLElement && e.target.blur()}
                    validate={[required(), number('Number Required')]}
                    label="Total Semesters"
                />
            </SimpleForm>
        </Create>
    );
};
export default CourseCreate;
