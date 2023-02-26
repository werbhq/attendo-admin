import { Chip } from '@mui/material';
import { SubjectDoc, SubjectSemester } from '../../../types/models/subject';

export const CustomSemesterField = ({ record }: { record: SubjectDoc }) => {
    if (!record.semesters || record.semesters?.length === 0) {
        return <ul style={{ padding: 0, margin: 0 }}>-</ul>;
    }

    return (
        <ul style={{ padding: 0, margin: 0 }}>
            {record.semesters.map((item, index) => (
                <Chip sx={{ ml: 0.5, mt: 1 }} key={index} label={item['semester']} />
            ))}
        </ul>
    );
};

export const CustomBranchField = ({ record }: { record: SubjectSemester }) => {
    if (!record.branchSubs || record?.branchSubs?.length === 0) {
        return <ul style={{ padding: 0, margin: 0 }}>-</ul>;
    }

    return (
        <ul style={{ padding: 0, margin: 0 }}>
            {record.branchSubs.map((item, index) => (
                <Chip sx={{ ml: 0.5, mt: 1 }} key={index} label={item.branch} />
            ))}
        </ul>
    );
};
