import * as React from "react";
import { Admin, Resource } from "react-admin";

import Classroom from "./pages/classroom/Index";
import DashBoard from "./pages/dashboard/Dashboard";
import Subject from "./pages/subjects";
import { dataProvider } from "./provider/firebase";

const App = () => (
  <Admin
    title="Attendo Admin"
    dataProvider={dataProvider}
    dashboard={DashBoard}
  >
    <Resource {...Classroom} />
    <Resource {...Subject} />
  </Admin>
);

export default App;

