import { Stack } from '@mui/material';
import * as React from 'react';
import {
    Edit,
    SimpleForm,
    TextInput,
    SimpleFormIterator,
    ArrayInput,
    SaveButton,
    useRefresh,
    useNotify,
    useRedirect,
    SelectInput,
    useDataProvider,
    required,
    NumberInput,
} from 'react-admin';
import { MAPPING } from '../../provider/mapping';
import { CustomAdd, CustomDelete, DeleteButtonDialog } from './components/CustomButtons';
import { useParams } from 'react-router-dom';
import { SubjectDoc } from '../../types/models/subject';
import { Schemes } from '../../Utils/Schemes';

const url = MAPPING.SUBJECT;

const SubjectEdit = () => {
    const { id } = useParams();
    const refresh = useRefresh();
    const notify = useNotify();
    const redirect = useRedirect();

    const dataProvider = useDataProvider();
    const possibleValues = Schemes.courses;
    const choices = possibleValues.map((value) => ({
        id: value,
        name: value,
    }));

    const deleteAll = async () => {
        await dataProvider.delete(url, {
            id: id,
        });

        notify(`Deleted ${id}`, {
            type: 'error',
        });
        refresh();
        redirect('list', url);
    };

    const handleSubmit = async (value: any) => {
        const data = value as SubjectDoc;
        data.semesters = data.semesters.map(({ semester, branchSubs }) => ({
            semester,
            branchSubs: branchSubs || [],
        }));

        await dataProvider.update<SubjectDoc>(url, {
            id: data.id,
            data: data,
            previousData: {},
        });

        notify(`Edited ${data.id}`, {
            type: 'success',
        });
        refresh();
        redirect('show', url, data.id);
    };

    return (
        <Edit>
            <SimpleForm onSubmit={handleSubmit} toolbar={false}>
                <TextInput disabled label="Id" source="id" />
                <TextInput source="organization" required />
                <SelectInput
                    source="course"
                    choices={choices}
                    validate={[required()]}
                    label="course"
                />
                <TextInput source="year" required />
                <ArrayInput source="semesters" fullWidth={false} label="Semesters">
                    <SimpleFormIterator
                        disableReordering
                        addButton={CustomAdd({ name: 'Add Semester' })}
                        removeButton={CustomDelete()}
                        getItemLabel={() => ''} // To remove index numbers
                    >
                        <NumberInput
                            source="semester"
                            onWheel={(e) => e.target instanceof HTMLElement && e.target.blur()}
                            label="Semester Number"
                        />
                    </SimpleFormIterator>
                </ArrayInput>
                <Stack spacing={3} direction={'row'} sx={{ mt: '20px' }}>
                    <SaveButton />
                    <DeleteButtonDialog handleDelete={deleteAll} />
                </Stack>
            </SimpleForm>
        </Edit>
    );
};

export default SubjectEdit;
