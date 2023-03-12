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
import { authProvider, dataProvider, isProd } from './provider/firebase';
import { CustomLayout } from './components/ui/Layout';
import { customQueryClient } from './provider/queryClient';

const myTheme = {
    ...defaultTheme,
    palette: {
        primary: {
            main: '#179F97',
        },
        secondary: {
            main: isProd ? '#179F97' : '#000',
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
