import React, {FC, lazy, Suspense, useEffect} from "react";
import {useAuth} from "../providers/AuthProvider";
import {CircularProgress} from "@mui/material";
import {Navigate, Route, Routes, useNavigate} from "react-router-dom";
import {UserRole} from "../enums/user-role";
import {ADMIN_MENU, STUDENT_MENU} from "../constants/menus";
const ProtectedRoutes = lazy(() => import('./ProtectedRoutes'));
const SignIn = lazy(() => import('./SignIn'));
const BaseLayout = lazy(() => import('./BaseLayout'));
const Groups = lazy(() => import('./Groups'));
const Group = lazy(() => import('./Group'));
const Faculties = lazy(() => import('./Faculties'));
const Faculty = lazy(() => import('./Faculty'));
const Students = lazy(() => import('./Students'));
const Student = lazy(() => import('./Student'));
const Teachers = lazy(() => import('./Teachers'));
const Teacher = lazy(() => import('./Teacher'));
const Disciplines = lazy(() => import('./Disciplines'));
const Discipline = lazy(() => import('./Discipline'));
const Schedule = lazy(() => import('./Schedule'));
const ScheduleSlot = lazy(() => import('./ScheduleSlot'));
const Location = lazy(() => import('./Location'));
const Locations = lazy(() => import('./Locations'));
const StudentSchedule = lazy(() => import('./StudentSchedule'));

const Router: FC = () => {
    const { authenticated, user } = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        if (authenticated && user?.role) {
            switch (user.role) {
                case UserRole.Admin: {
                    return navigate('/admin/groups');
                }
                case UserRole.Teacher: {
                    return navigate('/teacher');
                }
                case UserRole.Student: {
                    return navigate('/student/schedule');
                }
            }
        }
    }, []);

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
                                <Route path="/admin/students" element={<Students />} />
                                <Route path="/admin/student/:id?" element={<Student />} />
                                <Route path="/admin/teachers" element={<Teachers />} />
                                <Route path="/admin/teacher/:id?" element={<Teacher />} />
                                <Route path="/admin/groups" element={<Groups />} />
                                <Route path="/admin/group/:id?" element={<Group />} />
                                <Route path="/admin/faculties" element={<Faculties />} />
                                <Route path="/admin/faculty/:id?" element={<Faculty />} />
                                <Route path="/admin/disciplines" element={<Disciplines />} />
                                <Route path="/admin/discipline/:id?" element={<Discipline />} />
                                <Route path="/admin/schedule/:groupId/:id?" element={<Schedule />} />
                                <Route path="/admin/schedule/:groupId/:day/:time/:id?" element={<ScheduleSlot />} />
                                <Route path="/admin/locations" element={<Locations />} />
                                <Route path="/admin/location/:id?" element={<Location />} />
                            </Route>
                        </Route>
                        <Route path={"/student"} element={<ProtectedRoutes roles={[UserRole.Student]} />}>
                            <Route
                                path={'/student/'}
                                element={<BaseLayout menuItems={STUDENT_MENU} />}
                            >
                                <Route path="/student/schedule" element={<StudentSchedule />} />
                                <Route path="/student/schedule/:groupId" element={<Schedule />} />
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