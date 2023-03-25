import { Button } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import { useNotify, useRefresh, useDataProvider, useUpdate } from 'react-admin';
import { useRef } from 'react';
import { MAPPING } from 'provider/mapping';
import CSVReader from 'react-csv-reader';
import { AuthorizedTeacher } from 'types/models/teacher';
import { defaultParams } from 'provider/firebase';

const resource = MAPPING.AUTH_TEACHERS;

export const ImportButton = ({ csvExportHeaders, ...rest }: { csvExportHeaders: string[] }) => {
    const importRef = useRef<HTMLInputElement>(null);
    const notify = useNotify();
    const refresh = useRefresh();
    const dataProvider = useDataProvider();
    const [update] = useUpdate();
    const fileLoadHandler = async (data: AuthorizedTeacher[]) => {
        let filteredData = [];
        const record = await dataProvider.getList(resource, defaultParams).then((e) => e.data); //whole data will be read only while importing
        const invalidHeader = data.some((e) => {
            const keys = Object.keys(e).sort();
            const containsAllHeaders = csvExportHeaders.every((header) => keys.includes(header));
            return !containsAllHeaders;
        });
        if (invalidHeader) {
            const message = `Headers are invalid. Proper headers are ${csvExportHeaders.join(',')}`;
            return notify(message, { type: 'error' });
        } else {
            filteredData = data.filter(
                (e) => !record.some((value: { id: string }) => value.id === e.id)
            );
        }
        filteredData.forEach((e) => update(resource, { id: e.id, data: e }));
        refresh();
        notify(`Updated ${data.length} Teachers`, {
            type: 'success',
        });
    };

    return (
        <Button
            size="small"
            startIcon={<UploadIcon />}
            onClick={() => {
                if (importRef.current) {
                    importRef.current.value = '';
                    importRef.current.click();
                }
            }}
        >
            <CSVReader
                parserOptions={{
                    header: true,
                    dynamicTyping: true,
                    skipEmptyLines: true,
                }}
                inputRef={importRef}
                inputStyle={{ display: 'none' }}
                onFileLoaded={fileLoadHandler}
                onError={() => notify(`Error Importing CSV`, { type: 'error' })}
            />
            Import
        </Button>
    );
};
