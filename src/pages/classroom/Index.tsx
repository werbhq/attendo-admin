import ClassroomsList from './List';
import ClassroomShow from './Show';
import icon from '@mui/icons-material/School';
import { MAPPING } from 'provider/mapping';
import ClassroomsCreate from './Create';
import { ResourceProps } from 'react-admin';
import { Classroom as ClassroomType } from 'types/models/classroom';

const Classroom: ResourceProps = {
    name: MAPPING.CLASSROOMS,
    icon,
    options: { label: 'Classrooms' },
    list: ClassroomsList,
    show: ClassroomShow,
    create: ClassroomsCreate,
    recordRepresentation: (record: ClassroomType) => record.id,
};

export default Classroom;
