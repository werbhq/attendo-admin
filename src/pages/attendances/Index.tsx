import icon from '@mui/icons-material/CheckCircle';

import { MAPPING } from 'provider/mapping';

import { ResourceProps } from 'react-admin';
// import AttendanceCreate from './Create';
// import AttendanceEdit from './Edit';
import AttendanceList from './List';
import AttendanceShow from './Show';

const Attendance: ResourceProps = {
    name: MAPPING.ATTENDANCES,
    icon,
    options: { label: 'Attendances' },
    list: AttendanceList,
    show: AttendanceShow,
    // edit: AttendanceEdit,
    // create: AttendanceCreate,
};

export default Attendance;
