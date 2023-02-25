import icon from '@mui/icons-material/LocalPolice';

import { MAPPING } from '../../provider/mapping';
import AuthorizedTeacherList from './List';
import AuthorizedTeacherShow from './Show';
import AuthorizedTeacherEdit from './Edit';
import AuthorizedTeacherCreate from './Create';
import { ResourceProps } from 'react-admin';

const AuthTeachers: ResourceProps = {
    name: MAPPING.AUTH_TEACHERS,
    icon,
    options: { label: 'Teachers' },
    list: AuthorizedTeacherList,
    show: AuthorizedTeacherShow,
    edit: AuthorizedTeacherEdit,
    create: AuthorizedTeacherCreate,
    recordRepresentation: 'userName',
};

export default AuthTeachers;
