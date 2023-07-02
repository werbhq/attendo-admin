import { Schemes } from 'Utils/Schemes';
import SK from 'pages/source-keys';
import { useEffect, useState } from 'react';
import {
    ArrayInput,
    SelectInput,
    SimpleFormIterator,
    TextInput,
    required,
    useDataProvider,
} from 'react-admin';
import { Classroom, ClassroomVirtual } from 'types/models/classroom';
import { useFormContext } from 'react-hook-form';
import { defaultParams } from 'provider/firebase';
import { MAPPING } from 'provider/mapping';

const GroupLink = ({
    currentClassIdAlias,
    currentClassId,
    data,
    subjectId,
    parentClasses,
    groupLinksData = [],
    ...rest
}: {
    data: {
        scheme: null | string;
        branch: null | string;
        name: null | string;
        group: null | string;
        semester: null | number;
        batchId: null | string;
    };
    subjectId: string;
    parentClasses: string[];
    currentClassIdAlias: string;
    currentClassId?: string;
    groupLinksData?: ClassroomVirtual['groupLinks'];
}) => {
    const { setValue } = useFormContext();
    const dataProvider = useDataProvider();
    const [groupLinks, setGroupLinks] = useState<ClassroomVirtual['groupLinks']>(groupLinksData);

    useEffect(() => {
        // >1 because from edit screen { id: 'This Classroom' } will be already passed
        if (groupLinksData.length > 1) {
            setValue('groupLinks', groupLinksData, { shouldDirty: true });
            setGroupLinks(groupLinksData);
        }
    }, [groupLinksData, setValue]);

    useEffect(() => {
        if (groupLinksData.length > 1) return;

        if (
            !(data.name && data.branch && data.semester && subjectId && parentClasses.length !== 0)
        ) {
            setGroupLinks([]);
            return;
        }

        const filter = {
            branch: data.branch,
            name: data.name,
            isDerived: true,
            semester: data.semester,
            subjectId,
        };

        const getClasses = dataProvider.getList<Classroom>(MAPPING.CLASSROOMS, {
            ...defaultParams,
            filter,
        });

        getClasses.then(({ data }) => {
            // Get only the conflicting classes
            let newData = data.filter((classroom) =>
                Object.keys(classroom.parentClasses ?? {}).every((e) => parentClasses.includes(e))
            );

            // Remove currentId if exists
            if (currentClassId) newData = newData.filter((e) => e.id !== currentClassId);

            if (newData.length === 0) return;

            const groups = [{ id: currentClassIdAlias }, ...newData].map(({ id }, index) => ({
                id,
                group: String.fromCharCode('A'.charCodeAt(0) + index),
            }));

            setValue('groupLinks', groups);
            setGroupLinks(groups);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, parentClasses, subjectId]);

    if (groupLinks?.length === 0) return <></>;

    return (
        <ArrayInput
            {...rest}
            source={SK.CLASSROOM('groupLinks')}
            label="Please assign groups to classrooms"
        >
            <SimpleFormIterator inline disableAdd disableRemove disableReordering>
                <TextInput source="id" disabled={true} sx={{ width: '100%' }}  validate={required()} />
                <SelectInput source="group" choices={Schemes.groupNames}  validate={required()} />
            </SimpleFormIterator>
        </ArrayInput>
    );
};

export default GroupLink;
