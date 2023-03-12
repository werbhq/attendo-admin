import { Chip, Typography } from '@mui/material';
import { MAPPING } from 'provider/mapping';
import {
    ReferenceField,
    Show,
    Tab,
    TabbedShowLayout,
    TextField,
    WithRecord,
    useShowController,
} from 'react-admin';
import { AttendanceFrontEnd } from 'types/frontend/attendance';

const AttendanceShow = () => {
    const { record } = useShowController<AttendanceFrontEnd>();

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
                            <TextField source="id" />
                        </ReferenceField>
                        <TextField source="subject.name" />
                        <WithRecord
                            render={({ attendance }: AttendanceFrontEnd) =>
                                attendance.absentees ? (
                                    <div>
                                        <Typography
                                            sx={{ fontSize: '0.75em', color: 'rgba(0, 0, 0, 0.6)' }}
                                        >
                                            Absentees
                                        </Typography>
                                        {attendance.absentees.map((absentee, index) => (
                                            <Chip
                                                sx={{ ml: 0.5, mt: 1 }}
                                                label={absentee}
                                                key={index}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <></>
                                )
                            }
                        />

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
