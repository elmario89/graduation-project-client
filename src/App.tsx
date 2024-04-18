import React from 'react';
import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import SignIn from "./containers/SignIn";
import AuthProvider from "./providers/AuthProvider";

function App() {
  return (
    <div className="App">
        <AuthProvider>
            <SignIn />
        </AuthProvider>
    </div>
  );
}

export default App;
