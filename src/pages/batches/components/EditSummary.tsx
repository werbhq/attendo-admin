import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import { useState } from 'react';
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
} from 'react-admin';
import { Box, Stack } from '@mui/material';
import { MAPPING } from 'provider/mapping';
import { autoCapitalize } from 'Utils/helpers';
import { Schemes } from 'Utils/Schemes';
import { SubjectDoc } from 'types/models/subject';
import { defaultParams } from 'provider/firebase';

const resource = MAPPING.BATCHES;

function EditSummary({
    dialog,
    setDialog,
}: {
    dialog: {
        enable: boolean;
    };
    setDialog: React.Dispatch<
        React.SetStateAction<{
            enable: boolean;
        }>
    >;
}) {
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const refresh = useRefresh();
    const redirect = useRedirect();
    const record = useRecordContext();

    const [schemeData, setSchemeData] = useState<SubjectDoc[]>([]);
    const [isLoading, setLoading] = useState(true);
    const { getSemesters } = new Schemes(schemeData);

    const handleSave = async (data: any) => {
        await dataProvider.update(resource, {
            id: data.id,
            data: data,
            previousData: data,
        });

        refresh();
        notify(`Edited ${data.id}`, {
            type: 'success',
        });
        setDialog({ ...dialog, enable: false });
    };

    React.useEffect(() => {
        setLoading(true);
        dataProvider.getList<SubjectDoc>(MAPPING.SUBJECT, defaultParams).then((e) => {
            setSchemeData(e.data);
            setLoading(false);
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {!isLoading && (
                <Dialog
                    open={dialog.enable}
                    onClose={() => setDialog({ ...dialog, enable: false })}
                    fullWidth={true}
                >
                    <SimpleForm
                        defaultValues={record}
                        toolbar={false}
                        style={{ alignItems: 'stretch' }}
                        resource={resource}
                        onSubmit={handleSave}
                    >
                        <TextInput source="name" format={autoCapitalize} disabled={true} />
                        <SelectInput
                            source="semester"
                            choices={getSemesters(record.schemeId)}
                            required
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                                        notify('Course Deleted');
                                        redirect('list', resource);
                                    },
                                }}
                            />
                        </Stack>
                    </SimpleForm>
                </Dialog>
            )}
        </>
    );
}

export default EditSummary;
