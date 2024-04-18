import React from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import AuthProvider from "./providers/AuthProvider";
import ApiProvider from "./providers/ApiProvider";
import Router from "./containers/Router";
import {BrowserRouter} from "react-router-dom";

function App() {
  return (
      <BrowserRouter>
          <ApiProvider>
              <AuthProvider>
                  <Router />
              </AuthProvider>
          </ApiProvider>
      </BrowserRouter>
  );
}

export default App;
