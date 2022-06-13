import * as React from "react";
import { Admin, defaultTheme, Resource } from "react-admin";
import red from "@mui/material/colors/red";
import teal from "@mui/material/colors/teal";

import Classroom from "./pages/classroom/Index";
import DashBoard from "./pages/dashboard/Dashboard";
import Subject from "./pages/subjects/Index";
import { authProvider, dataProvider } from "./provider/firebase";

const myTheme = {
  ...defaultTheme,
  palette: {
    primary: {
      main: "#7B61FF",
    },
    secondary: {
      main: "#179F97",
    },
    error: red,
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
  typography: {
    fontFamily: ["Poppins", "sans-serif"].join(","),
  },
};

const App = () => (
  <Admin
    title="Attendo Admin"
    theme={myTheme}
    dataProvider={dataProvider}
    authProvider={authProvider}
    dashboard={DashBoard}
  >
    <Resource {...Classroom} />
    <Resource {...Subject} />
  </Admin>
);

export default App;
