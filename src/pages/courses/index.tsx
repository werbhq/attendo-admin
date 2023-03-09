import icon from '@mui/icons-material/MenuBook';
import { MAPPING } from 'provider/mapping';
import { ResourceProps } from 'react-admin';
import CourseCreate from './Create';
import CoursesList from './List';
import CourseShow from './Show';
import CourseEdit from './Edit';

const Batches: ResourceProps = {
    name: MAPPING.COURSES,
    icon,
    options: { label: 'Courses' },
    list: CoursesList,
    show: CourseShow,
    create: CourseCreate,
    edit: CourseEdit,
    recordRepresentation: 'id',
};

export default Batches;
