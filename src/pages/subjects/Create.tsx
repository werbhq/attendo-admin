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
import { MAPPING } from 'provider/mapping';
import { noSpaceValidation } from 'Utils/validations';
import { SubjectDoc } from 'types/models/subject';
import { Course } from 'types/models/courses';
import { defaultParams } from 'provider/firebase';
import { useEffect, useState } from 'react';
import { convertSingleValueListToSelectList } from 'Utils/helpers';
import SK from 'pages/source-keys';

const url = MAPPING.SUBJECT;

const SubjectCreate = () => {
    const dataProvider = useDataProvider();
    const refresh = useRefresh();
    const notify = useNotify();
    const redirect = useRedirect();

    const [courseChoices, setCourseChoices] = useState<{ id: string; name: string }[]>([]);

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

    useEffect(() => {
        dataProvider.getList<Course>(MAPPING.COURSES, defaultParams).then((e) => {
            setCourseChoices(e.data.map((e) => e.id).map(convertSingleValueListToSelectList));
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Create>
            <SimpleForm onSubmit={onSubmit}>
                <TextInput
                    source={SK.SYLLABUS("organization")}
                    format={(props) => props?.toUpperCase() ?? ''}
                    validate={[required(), noSpaceValidation]}
                />
                <NumberInput
                    source={SK.SYLLABUS("year")}
                    onWheel={(e) => e.target instanceof HTMLElement && e.target.blur()}
                    validate={[required(), number('Number Required')]}
                    label="Year"
                />
                <SelectInput
                    source={SK.SYLLABUS("course")}
                    choices={courseChoices}
                    validate={[required(), noSpaceValidation]}
                    label="Course"
                />
            </SimpleForm>
        </Create>
    );
};

export default SubjectCreate;
