import React, { FC, lazy, Suspense } from "react";
import { useAuth } from "../providers/AuthProvider";
import { CircularProgress } from "@mui/material";
import { Navigate, Route, Routes } from "react-router-dom";
import { UserRole } from "../enums/user-role";
import { ADMIN_MENU, STUDENT_MENU, TEACHER_MENU } from "../constants/menus";
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
const Auditory = lazy(() => import('./Auditory'));
const Auditories = lazy(() => import('./Auditories'));
const Building = lazy(() => import('./Building'));
const Buildings = lazy(() => import('./Buildings'));
const StudentVisits = lazy(() => import('./StudentVisits'));
const TeacherDisciplines = lazy(() => import('./TeacherDisciplines'));
const TeacherGroups = lazy(() => import('./TeacherGroups'));
const TeacherGroup = lazy(() => import('./TeacherGroup'));

const Router: FC = () => {
    const { authenticated, user } = useAuth();

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
                                <Route path="/admin/institutes" element={<Faculties />} />
                                <Route path="/admin/institute/:id?" element={<Faculty />} />
                                <Route path="/admin/disciplines" element={<Disciplines />} />
                                <Route path="/admin/discipline/:id?" element={<Discipline />} />
                                <Route path="/admin/schedule/:groupId/:id?" element={<Schedule />} />
                                <Route path="/admin/schedule/:groupId/:day/:time/:id?" element={<ScheduleSlot />} />
                                <Route path="/admin/auditories" element={<Auditories />} />
                                <Route path="/admin/auditory/:id?" element={<Auditory />} />
                                <Route path="/admin/buildings" element={<Buildings />} />
                                <Route path="/admin/building/:id?" element={<Building />} />
                            </Route>
                        </Route>
                        <Route path={"/student"} element={<ProtectedRoutes roles={[UserRole.Student]} />}>
                            <Route
                                path={'/student/'}
                                element={<BaseLayout menuItems={STUDENT_MENU} />}
                            >
                                <Route path="/student/schedule/" element={<Navigate to={`/student/schedule/${user?.groupId}`} replace />} />
                                <Route path="/student/schedule/:groupId" element={<Schedule forStudent />} />
                                <Route path="/student/visits/:disciplineId/:groupId/:studentId" element={<StudentVisits />} />
                            </Route>
                        </Route>
                        <Route path={"/teacher"} element={<ProtectedRoutes roles={[UserRole.Teacher]} />}>
                            <Route
                                path={'/teacher/'}
                                element={<BaseLayout menuItems={TEACHER_MENU} />}
                            >
                                <Route path="/teacher/schedule" element={<Navigate to={`/teacher/schedule/${user?.id}`} replace />} />
                                <Route path="/teacher/schedule/:teacherId" element={<Schedule forStudent />} />
                                <Route path="/teacher/disciplines" element={<TeacherDisciplines />} />
                                <Route path="/teacher/groups/:disciplineId" element={<TeacherGroups />} />
                                <Route path="/teacher/group/:disciplineId/:groupId" element={<TeacherGroup />} />
                                <Route path="/teacher/visits/:disciplineId/:groupId/:studentId" element={<StudentVisits forTeacher />} />
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