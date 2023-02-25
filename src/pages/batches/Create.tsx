import {
    required,
    number,
    Create,
    SimpleForm,
    NumberInput,
    TextInput,
    useRedirect,
    useRefresh,
    useNotify,
    SelectInput,
    BooleanInput,
    useDataProvider,
} from 'react-admin';
import { useState, useMemo } from 'react';
import { MAPPING } from '../../provider/mapping';
import { noSpaceValidation } from '../../Utils/validations';
import { Schemes } from '../../Utils/Schemes';
import { defaultParams } from '../../provider/firebase';
import { Batch } from '../../types/models/batch';
import { SubjectDoc } from '../../types/models/subject';
import { convertSingleValueListToSelectList } from '../../Utils/helpers';

const url = MAPPING.BATCHES;

const BatchesCreate = () => {
    const dataProvider = useDataProvider();
    const [schemeData, setSchemeData] = useState<SubjectDoc[]>([]);

    if (schemeData.length === 0) {
        dataProvider.getList<SubjectDoc>(MAPPING.SUBJECT, defaultParams).then((e) => {
            setSchemeData(e.data);
        });
    }
    const { getSchemes, getSemesters } = new Schemes(schemeData);
    const refresh = useRefresh();
    const notify = useNotify();
    const redirect = useRedirect();
    const [currentData, setCurrentData] = useState({
        course: null,
        scheme: null,
        semester: null,
    });

    // Choices
    const courseChoices = Schemes.courses.map(convertSingleValueListToSelectList);

    const schemeChoices = useMemo(() => {
        return getSchemes(currentData.course ?? '');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentData.course]);

    const semesterChoices = useMemo(() => {
        return getSemesters(currentData.scheme ?? '');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentData.semester]);

    const validateBatches = (values: any) => {
        const errors: { [index: string]: string } = {};
        const id = (e: Batch) => e.id;

        const customValidator = (data: any[], fieldName: string) => {
            if (!data.map(id).includes(values[fieldName])) {
                errors[fieldName] = 'ra.validation.required';
            }
        };

        customValidator(courseChoices, 'course');
        customValidator(schemeChoices, 'schemeId');
        customValidator(semesterChoices, 'semester');

        return errors;
    };

    const onSubmit = async (e: any) => {
        const data = e as Batch;
        const id = `${data.course.toLowerCase()}-${data.yearOfJoining}`;
        data.id = id;
        data.name = data.name.toUpperCase();
        try {
            await dataProvider.create(url, { data, meta: { id } });
            notify(`Added ${id}`, { type: 'success' });
            refresh();
            redirect('list', url);
        } catch (error: any) {
            notify(error.message, { type: 'error' });
        }
    };

    return (
        <Create>
            <SimpleForm onSubmit={onSubmit} validate={validateBatches}>
                <TextInput
                    source="name"
                    label="Batch Name"
                    format={(e) => e?.toUpperCase() ?? ''}
                    validate={[required()]}
                />
                <SelectInput
                    source="course"
                    choices={courseChoices}
                    validate={[required(), noSpaceValidation]}
                    label="Course"
                    onChange={(e) => setCurrentData({ ...currentData, course: e.target.value })}
                />
                <SelectInput
                    source="schemeId"
                    choices={schemeChoices}
                    onChange={(e) => setCurrentData({ ...currentData, scheme: e.target.value })}
                    disabled={schemeChoices.length === 0 ? true : false}
                    required
                />
                <NumberInput
                    source="yearOfJoining"
                    onWheel={(e) => e.target instanceof HTMLElement && e.target.blur()}
                    validate={[required(), number('Number Required')]}
                    label="Year Of Joining"
                />
                <SelectInput
                    source="semester"
                    choices={getSemesters(currentData.scheme ?? '')}
                    onChange={(e) => setCurrentData({ ...currentData, semester: e.target.value })}
                    disabled={getSemesters(currentData.scheme ?? '').length === 0 ? true : false}
                    required
                />

                <BooleanInput source="running" validate={[required()]} />
            </SimpleForm>
        </Create>
    );
};
export default BatchesCreate;
