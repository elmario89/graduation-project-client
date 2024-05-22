import {createContext, FC, PropsWithChildren, useContext, useMemo, useState} from "react";
import {useApi} from "./ApiProvider";
import {AxiosError} from "axios";
import {Student} from "../types/student";
import {Alert, Snackbar} from "@mui/material";
import {AddOrUpdateStudent} from "../types/add-or-update-student";

type StudentsContextType = {
    getAllStudents: () => Promise<void>;
    createStudent: (data: Omit<AddOrUpdateStudent, 'id'>) => Promise<Student | undefined>;
    updateStudent: (data: AddOrUpdateStudent) => Promise<Student | undefined>;
    getStudentById: (id: string) => Promise<Student | undefined>;
    students: Student[] | null;
    deleteStudent: (id: string) => Promise<void>;
    getStudentsByGroup: (groupId: string) => Promise<Student[] | undefined>;
}

type ErrorType = "error" | "success" | "info" | "warning" | undefined;

const StudentsContext = createContext<StudentsContextType>({} as StudentsContextType);

const StudentsProvider: FC<PropsWithChildren> = ({ children }) => {
    const [alert, setAlert] =
        useState<{ message: string, type: ErrorType } | null>(null);
    const [students, setStudents] = useState<Student[] | null>(null);
    const { studentsApi } = useApi();

    const getAllStudents = async () => {
        try {
            const students = await studentsApi.getAllStudents();
            setStudents(students);
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                setAlert({ message: e.message, type: 'error' });
            }
        }
    }

    const getStudentsByGroup = async (groupId: string) => {
        try {
            return await studentsApi.getStudentsByGroup(groupId);
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                setAlert({ message: e.message, type: 'error' });
            }
        }
    }

    const createStudent = async (data: Omit<AddOrUpdateStudent, 'id'>) => {
        try {
            const student = await studentsApi.createStudent(data);
            setAlert({ message: 'Студент создан', type: 'success' });
            return student;
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                setAlert({ message: e.message, type: 'error' });
            }
        }
    }

    const updateStudent = async (data: AddOrUpdateStudent) => {
        try {
            const student = await studentsApi.updateStudent(data);
            setAlert({ message: 'Студент обновлен', type: 'success' });
            return student;
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                setAlert({ message: e.message, type: 'error' });
            }
        }
    }

    const getStudentById = async (id: string) => {
        try {
            return await studentsApi.getStudentById(id);
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                setAlert({ message: e.message, type: 'error' });
            }
        }
    }

    const deleteStudent = async (id: string) => {
        try {
            await studentsApi.deleteStudent(id);
            setAlert({ message: 'Студент удален', type: 'success' });
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                setAlert({ message: e.message, type: 'error' });
            }
        }
    }

    const memoValue = useMemo(() => ({
        getAllStudents,
        students,
        createStudent,
        getStudentById,
        updateStudent,
        deleteStudent,
        getStudentsByGroup,
    }), [getAllStudents, students, createStudent, getStudentById, deleteStudent, getStudentsByGroup]);

    return <StudentsContext.Provider value={memoValue}>
        <Snackbar open={!!alert} autoHideDuration={6000} onClose={() => setAlert(null)}>
            <Alert
                onClose={() => setAlert(null)}
                severity={alert?.type}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {alert?.message}
            </Alert>
        </Snackbar>
        {children}
    </StudentsContext.Provider>
}

export const useStudents = () => useContext(StudentsContext);

export default StudentsProvider;