import React, {FC, Suspense} from "react";
import {useAuth} from "../providers/AuthProvider";
import {CircularProgress} from "@mui/material";
import {Navigate, Route, Routes} from "react-router-dom";
import SignIn from "./SignIn";

const Router: FC = () => {
    const { authenticated } = useAuth();

    return (
        <Suspense fallback={<CircularProgress />}>
            <Routes>
                {authenticated ? (
                    <>
                        <Route
                            path={'/'}
                            element={<span>You are logged in</span>}
                        />
                    </>
                    ) : (
                    <>
                        <Route
                            path={'*'}
                            element={<Navigate to={'/sign-in'} replace />}
                        />
                        <Route
                            path={'/sign-in'}
                            element={<SignIn />}
                        />
                    </>
                )}
            </Routes>
        </Suspense>
    )
}

export default Router;