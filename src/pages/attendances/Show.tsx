import { Chip, Typography } from '@mui/material';
import { dataProvider, defaultParams } from 'provider/firebase';
import { MAPPING } from 'provider/mapping';
import { useState } from 'react';
import {
    ArrayField,
    ChipField,
    FunctionField,
    ListContextProvider,
    ReferenceArrayField,
    ReferenceField,
    Show,
    SingleFieldList,
    Tab,
    TabbedShowLayout,
    TextField,
    useList,
    useRecordContext,
    useShowContext,
    useShowController,
} from 'react-admin';
import { Classroom } from 'types/models/classroom';

const AttendanceShow = () => {
    const { record } = useShowController();
    const absentees = record.attendance.absentees ?? [];


    return (
        <Show emptyWhileLoading>
            {record !== undefined && (
                <TabbedShowLayout>
                    <Tab label="summary">
                        <TextField source="id" />
                        <TextField source="attendance.date" label="Date" />
                        <ReferenceField
                            source="attendance.teacherId"
                            label="Teacher"
                            reference={MAPPING.AUTH_TEACHERS}
                            link="show"
                        />
                        <ReferenceField
                            source="classroom.id"
                            label="Classroom Id"
                            reference={MAPPING.CLASSROOMS}
                            link="show"
                        >
                            {' '}
                            <TextField source="id" />
                        </ReferenceField>
                        <TextField source="subject.name" />
                        {absentees && (
                            <div>
                                <Typography
                                    sx={{ fontSize: '0.75em', color: 'rgba(0, 0, 0, 0.6)' }}
                                >
                                    Absentees
                                </Typography>
                                {absentees.map((absentee: any) => (
                                    <Chip  sx={{ ml: 0.5, mt: 1 }} label={absentee} />
                                ))}{' '}
                            </div>
                        )}
                        {/* <Typography sx={{ fontSize: '0.75em', color: 'rgba(0, 0, 0, 0.6)' }}>
                            Absentees
                        </Typography>
                        <FunctionField
                            label="Absentees"
                            render={(record: Classroom) => Object.values(record?.students).find((e)=>absentees.contains(e.id))?.name??[]}
                        ></FunctionField> */}
                    </Tab>
                </TabbedShowLayout>
            )}
        </Show>
    );
};
export default AttendanceShow;
