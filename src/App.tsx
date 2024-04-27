import React from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import 'dayjs/locale/ru'
import AuthProvider from "./providers/AuthProvider";
import ApiProvider from "./providers/ApiProvider";
import Router from "./containers/Router";
import {BrowserRouter} from "react-router-dom";
import GroupsProvider from "./providers/GroupsProvider";
import {Global} from '@emotion/react'
import dayjs from "dayjs";
import GlobalStyles from "./global-styles";
import FacultiesProvider from "./providers/FacultiesProvider";
import StudentsProvider from "./providers/StudentsProvider";
import TeachersProvider from "./providers/TeachersProvider";
import DisciplinesProvider from "./providers/DisciplinesProvider";
import SchedulesProvider from "./providers/ScheduleProvider";
import LocationsProvider from "./providers/LocationsProvider";
dayjs.locale('ru')

function App() {
  return (
      <>
          <Global
              styles={GlobalStyles}
          />
          <BrowserRouter>
              <ApiProvider>
                  <AuthProvider>
                      <GroupsProvider>
                          <FacultiesProvider>
                              <StudentsProvider>
                                  <TeachersProvider>
                                      <DisciplinesProvider>
                                          <SchedulesProvider>
                                              <LocationsProvider>
                                                  <Router />
                                              </LocationsProvider>
                                          </SchedulesProvider>
                                      </DisciplinesProvider>
                                  </TeachersProvider>
                              </StudentsProvider>
                          </FacultiesProvider>
                      </GroupsProvider>
                  </AuthProvider>
              </ApiProvider>
          </BrowserRouter>
      </>
  );
}

export default App;
