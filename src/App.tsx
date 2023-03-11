import { Admin, defaultTheme, Resource } from 'react-admin';
import red from '@mui/material/colors/red';
import Classroom from './pages/classroom/Index';
import DashBoard from './pages/dashboard/Dashboard';
import Subject from './pages/subjects';
import Batches from './pages/batches';
import Courses from './pages/courses';
import Attendance from './pages/attendances/Index';
import { RaDatagrid, RaList } from 'components/ui/style';
import AuthTeachers from './pages/authTeachers';
import { authProvider, dataProvider } from './provider/firebase';
import { CustomLayout } from './components/ui/Layout';
import { customQueryClient } from './provider/queryClient';
import { kMode } from 'config';
import { MODE } from 'Utils/helpers';

const myTheme = {
    ...defaultTheme,
    palette: {
        primary: {
            main: kMode === MODE.DEV ? '#000' : '#179F97',
        },
        secondary: {
            main: kMode === MODE.DEV ? '#000' : '#179F97',
        },
        error: red,
        contrastThreshold: 3,
        tonalOffset: 0.2,
    },
    typography: {
        fontFamily: ['Poppins', 'sans-serif'].join(','),
    },
    components: {
        ...defaultTheme.components,
        RaDatagrid,
        RaList,
    },
};

const App = () => (
    <Admin
        title="Attendo Admin"
        theme={myTheme}
        dataProvider={dataProvider}
        authProvider={authProvider}
        queryClient={customQueryClient}
        dashboard={DashBoard}
        layout={CustomLayout}
    >
        <Resource {...AuthTeachers} />
        <Resource {...Courses} />
        <Resource {...Subject} />
        <Resource {...Batches} />
        <Resource {...Classroom} />
        <Resource {...Attendance} />
    </Admin>
);

export default App;
