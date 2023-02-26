import { Admin, defaultTheme, RaThemeOptions, Resource } from 'react-admin';
import red from '@mui/material/colors/red';
import Classroom from './pages/classroom/Index';
import DashBoard from './pages/dashboard/Dashboard';
import Subject from './pages/subjects';
import Batches from './pages/batches';
import Courses from './pages/courses';
import AuthTeachers from './pages/authTeachers';
import { authProvider, dataProvider } from './provider/firebase';
import { CustomLayout } from './components/ui/Layout';
import { customQueryClient } from './provider/queryClient';

const myTheme: RaThemeOptions = {
    ...defaultTheme,
    palette: {
        primary: {
            main: '#7B61FF',
        },
        secondary: {
            main: '#179F97',
        },
        error: red,
        contrastThreshold: 3,
        tonalOffset: 0.2,
    },
    typography: {
        fontFamily: ['Poppins', 'sans-serif'].join(','),
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
    </Admin>
);

export default App;
