import { List, Tab, TopToolbar, ExportButton, downloadCSV, useDataProvider } from 'react-admin';
import { MAPPING } from 'provider/mapping';
import { Box, MenuItem, Select, Stack, Typography } from '@mui/material';
import jsonExport from 'jsonexport/dist';
import AttendanceDataGrid from '../components/report/ShowAttendanceGrid';
import { Classroom } from 'types/models/classroom';
import { useEffect, useState } from 'react';
import { SubjectDoc } from 'types/models/subject';
import { Report } from 'types/frontend/report';
import PageLoader from 'components/ui/PageLoader';

const ReportTab = ({
    record,
    label,
    path,
    ...props
}: {
    record: Classroom;
    label: string;
    path: string;
    props?: any;
}) => {
    const [semester, setSemester] = useState(record.batch.semester ?? 1);
    const [semesterChoices, setSemesterChoices] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const dataProvider = useDataProvider();

    useEffect(() => {
        setIsLoading(true);
        dataProvider
            .getOne<SubjectDoc>(MAPPING.SUBJECT, { id: record?.batch.schemeId })
            .then((e) => {
                const totalSemesters = e.data.semesters.length;
                const semesters = [];
                for (let i = 0; i < totalSemesters; i++)
                    semesters.push(e.data.semesters[i].semester);
                setSemesterChoices(semesters);
                if (totalSemesters !== 0) setSemester(semesters[semesters.length - 1]);
                setIsLoading(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const reportsExporter = (data: Report[]) => {
        const headersReports = ['id', 'regNo', 'rollNo', 'name'];

        const dataForExport = data.map(({ id, regNo, rollNo, name, attendance }) => {
            const data: { [index: string]: string | number } = { id, regNo, rollNo, name };
            attendance.forEach((e) => {
                data[`${e.name} [${e.subjectId.toUpperCase()}]`] =
                    e.percentage === -1 ? '-' : `${e.percentage}%`;
            });
            return data;
        });

        jsonExport(dataForExport, { headers: headersReports }, (err, csv) => {
            downloadCSV(
                csv,
                `${record?.id} S${
                    record?.isDerived ? record?.batch.semester : record?.semester
                } Report`
            );
        });
    };

    const ReporterToolBar = () => (
        <TopToolbar>
            <Stack direction="row" spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography>Semester</Typography>
                </Box>
                <Select
                    value={semester}
                    label="Semester"
                    onChange={(e) => setSemester(e.target.value as number)}
                    sx={{ width: '60px' }}
                >
                    {semesterChoices.map((e) => (
                        <MenuItem value={e} key={e}>
                            {e}
                        </MenuItem>
                    ))}
                </Select>
                <ExportButton />
            </Stack>
        </TopToolbar>
    );

    if (isLoading) return <PageLoader loading={isLoading} />;

    return (
        <Tab label={label} path={path} {...props}>
            <List
                resource={MAPPING.REPORTS}
                filter={{ semester, classroomId: record.id }}
                pagination={false}
                exporter={reportsExporter}
                actions={<ReporterToolBar />}
                empty={false}
            >
                <AttendanceDataGrid />
            </List>
        </Tab>
    );
};

export default ReportTab;
