import React, {FC, Suspense} from "react";
import {useAuth} from "../providers/AuthProvider";
import {CircularProgress} from "@mui/material";
import {Navigate, Route, Routes} from "react-router-dom";
import SignIn from "./SignIn";
import ProtectedRoutes from "./ProtectedRoutes";
import {UserRole} from "../enums/user-role";
import BaseLayout from "./BaseLayout";

const Router: FC = () => {
    const { authenticated } = useAuth();

    return (
        <Suspense fallback={<CircularProgress />}>
            <Routes>
                {authenticated ? (
                    <Route path={"/admin"} element={<ProtectedRoutes roles={[UserRole.Admin]} />}>
                        <Route
                            path={'/admin/'}
                            element={<BaseLayout />}
                        >
                            <Route path="/admin/add-student" element={<span>Student creation here</span>} />
                        </Route>
                    </Route>
                    ) : (
                    <>
                        <Route
                            path={'*'}
                            element={<Navigate to={'/sign-in'} replace />}
                        />
                    </>
                )}
                <Route
                    path={'/sign-in'}
                    element={<SignIn />}
                />
                <Route path={"/403"} element={<span>Not found</span>} />
                <Route path={"*"} element={<span>Not found</span>} />
            </Routes>
        </Suspense>
    )
}

export default Router;