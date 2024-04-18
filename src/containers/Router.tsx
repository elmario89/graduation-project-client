import React, {FC, lazy, Suspense} from "react";
import {useAuth} from "../providers/AuthProvider";
import {CircularProgress} from "@mui/material";
import {Navigate, Route, Routes} from "react-router-dom";
import {UserRole} from "../enums/user-role";
import {ADMIN_MENU} from "../constants/menus";
const ProtectedRoutes = lazy(() => import('./ProtectedRoutes'));
const SignIn = lazy(() => import('./SignIn'));
const BaseLayout = lazy(() => import('./BaseLayout'));
const Groups = lazy(() => import('./Groups'));
const Group = lazy(() => import('./Group'));

const Router: FC = () => {
    const { authenticated } = useAuth();

    return (
        <Suspense fallback={
            <div
                style={{
                    height: '100vh',
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <CircularProgress />
            </div>
        }>
            <Routes>
                {authenticated ? (
                    <>
                        <Route path={"/admin"} element={<ProtectedRoutes roles={[UserRole.Admin]} />}>
                            <Route
                                path={'/admin/'}
                                element={<BaseLayout menuItems={ADMIN_MENU} />}
                            >
                                <Route path="/admin/add-student" element={<span>Student creation here</span>} />
                                <Route path="/admin/groups" element={<Groups />} />
                                <Route path="/admin/group/:id?" element={<Group />} />
                            </Route>
                        </Route>
                        <Route path={"/student"} element={<ProtectedRoutes roles={[UserRole.Student]} />}>
                            <Route
                                path={'/student/'}
                                element={<BaseLayout menuItems={ADMIN_MENU} />}
                            >
                                <Route path="/student/groups" element={<Groups />} />
                            </Route>
                        </Route>
                    </>
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