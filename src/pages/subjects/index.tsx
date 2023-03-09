import icon from '@mui/icons-material/Class';
import SubjectList from './List';
import SubjectShow from './Show';
import SubjectEdit from './Edit';
import SubjectCreate from './Create';
import { MAPPING } from 'provider/mapping';
import { ResourceProps } from 'react-admin';

const Subject: ResourceProps = {
    name: MAPPING.SUBJECT,
    icon,
    options: { label: 'Syllabus' },
    list: SubjectList,
    show: SubjectShow,
    edit: SubjectEdit,
    create: SubjectCreate,
    recordRepresentation: 'id',
};

export default Subject;
